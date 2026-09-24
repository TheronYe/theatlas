// 探测全景资源可下载性（同域 / CDN），输出状态+体积+类型
const net = require('net');
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

function head(host, rawPath, cb) {
  socksConnect(host, 443, (err, sock) => {
    if (err) return cb(err);
    const t = tls.connect({ socket: sock, servername: host, rejectUnauthorized: false }, () => {
      t.write('GET ' + rawPath + ' HTTP/1.1\r\nHost: ' + host + '\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nRange: bytes=0-2047\r\nConnection: close\r\n\r\n');
    });
    const ch = [];
    t.on('data', (c) => ch.push(c));
    t.on('end', () => {
      const buf = Buffer.concat(ch);
      const sep = buf.indexOf('\r\n\r\n');
      const hd = sep === -1 ? '' : buf.slice(0, sep).toString('utf8');
      const st = +(hd.match(/HTTP\/1\.[01] (\d+)/) || [0, 0])[1];
      const cl = (hd.match(/Content-Length: (\d+)/i) || [0, 0])[1];
      const cr = (hd.match(/Content-Range: bytes \d+-(\d+)\/(\d+)/i) || []);
      const ct = (hd.match(/Content-Type: ([^\r\n]+)/i) || [0, ''])[1];
      cb(null, { status: st, len: cr[2] || cl, type: ct.trim(), bytes: sep === -1 ? 0 : buf.length - sep - 4 });
    });
    t.on('error', cb);
  });
}

const host = '720vr.midland.com.hk';
const cands = [
  '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/imgs/preview.jpg',
  '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/imgs/thumb.jpg',
  '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/imgs/preview.webp',
  '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/tiles/1/0_0.jpg',
  '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/imgs/1.jpg'
];
let i = 0;
(function next() {
  if (i >= cands.length) return;
  const p = cands[i++];
  head(host, p, (err, r) => {
    console.log((err ? 'ERR ' + err.message : 'status=' + r.status + ' len=' + r.len + ' type=' + r.type) + '  <- ' + p);
    next();
  });
})();