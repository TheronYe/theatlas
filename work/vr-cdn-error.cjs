// 读取 CDN 567 错误页正文，判断失败原因
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

function get(host, rawPath, cb) {
  socksConnect(host, 443, (err, sock) => {
    if (err) return cb(err);
    const t = tls.connect({ socket: sock, servername: host, rejectUnauthorized: false }, () => {
      t.write('GET ' + rawPath + ' HTTP/1.1\r\nHost: ' + [host, 'https://720vr.midland.com.hk/'].join('\r\nReferer: ') + '\r\nUser-Agent: Mozilla/5.0\r\nAccept: image/*,*/*\r\nConnection: close\r\n\r\n');
    });
    const ch = [];
    t.on('data', (c) => ch.push(c));
    t.on('end', () => cb(null, Buffer.concat(ch)));
    t.on('error', cb);
  });
}

get('ssl-panoimg0.720static.com', '/resource/prod/a343a30ds2x/1f3jO5uaem1/9349369/imgs/thumb.jpg', (err, buf) => {
  if (err) return console.log('ERR: ' + err.message);
  const s = buf.toString('utf8');
  const sep = s.indexOf('\r\n\r\n');
  console.log(s.slice(0, sep));
  console.log('--- body head ---');
  console.log(s.slice(sep + 4, sep + 4 + 1200));
});