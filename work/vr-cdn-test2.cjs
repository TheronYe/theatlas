// 娴嬭瘯 panorama CDN 鍙笅杞芥€?const net = require('net');
const tls = require('tls');
const PROXY = { host: '127.0.0.1', port: 10808 };

function socksConnect(h, p, cb) {
  const s = net.connect(PROXY.port, PROXY.host, () => s.write(Buffer.from([5, 1, 0])));
  let st = 0;
  const onData = (d) => {
    if (st === 0) {
      if (d[0] !== 5 || d[1] !== 0) return cb(new Error('handshake'));
      const hb = Buffer.from(h, 'utf8');
      st = 1;
      s.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([(p >> 8) & 255, p & 255])]));
    } else if (st === 1) {
      if (d[1] !== 0) return cb(new Error('code=' + d[1]));
      s.removeListener('data', onData); s.setTimeout(0); cb(null, s);
    }
  };
  s.on('data', onData); s.on('error', cb);
  s.setTimeout(30000, () => cb(new Error('timeout')));
}

function get(host, rawPath, cb) {
  socksConnect(host, 443, (err, sock) => {
    if (err) return cb(err);
    const t = tls.connect({ socket: sock, servername: host, rejectUnauthorized: false }, () => {
      t.write('GET ' + rawPath + ' HTTP/1.1\r\nHost: ' + host + '\r\nUser-Agent: Mozilla/5.0\r\nReferer: https://720vr.midland.com.hk/\r\nAccept: image/*,*/*\r\nConnection: close\r\n\r\n');
    });
    const ch = [];
    t.on('data', (c) => ch.push(c));
    t.on('end', () => {
      const buf = Buffer.concat(ch);
      const sep = buf.indexOf('\r\n\r\n');
      const hd = sep === -1 ? '' : buf.slice(0, sep).toString('utf8');
      const st = +(hd.match(/HTTP\/1\.[01] (\d+)/) || [0, 0])[1];
      const cl = +(hd.match(/Content-Length: (\d+)/i) || [0, 0])[1];
      const ct = ((hd.match(/Content-Type: ([^\r\n]+)/i) || [0, ''])[1] || '').trim();
      cb(null, { status: st, len: cl, type: ct, body: sep === -1 ? Buffer.alloc(0) : buf.slice(sep + 4) });
    });
    t.on('error', cb);
  });
}

// tour.js 涓?cdn 鍙橀噺鍊奸渶瑕佺‘璁わ紱鍏堣瘯甯歌鍊?const hosts = ['ssl-panoimg0.720static.com'];
const panoPath = '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/imgs/preview.jpg';
let i = 0;
(function next() {
  if (i >= hosts.length) return;
  const h = hosts[i++];
  get(h, panoPath, (err, r) => {
    console.log(h + ' -> ' + (err ? 'ERR ' + err.message : 'status=' + r.status + ' len=' + r.len + ' type=' + r.type + ' head=' + r.body.slice(0, 4).toString('hex')));
    next();
  });
})();
