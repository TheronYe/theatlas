// 下载 VR 站点指定资源到本地镜像目录
const net = require('net');
const tls = require('tls');
const fs = require('fs');
const path = require('path');

const PROXY = { host: '127.0.0.1', port: 10808 };
const HOST = '720vr.midland.com.hk';
const BASE = '/vr/KL/%E6%93%8E%E6%B5%B7/';
const OUT = path.join(__dirname, '..', 'assets', 'vr', 'midland');

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
      if (d[1] !== 0) return cb(new Error('connect code=' + d[1]));
      s.removeListener('data', onData); s.setTimeout(0); cb(null, s);
    }
  };
  s.on('data', onData); s.on('error', cb);
  s.setTimeout(30000, () => cb(new Error('timeout')));
}

function get(rawPath, cb) {
  socksConnect(HOST, 443, (err, sock) => {
    if (err) return cb(err);
    const t = tls.connect({ socket: sock, servername: HOST, rejectUnauthorized: false }, () => {
      t.write('GET ' + rawPath + ' HTTP/1.1\r\nHost: ' + HOST + '\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nConnection: close\r\n\r\n');
    });
    const ch = [];
    t.on('data', (c) => ch.push(c));
    t.on('end', () => {
      const buf = Buffer.concat(ch);
      const sep = buf.indexOf('\r\n\r\n');
      if (sep === -1) return cb(new Error('bad response'));
      const head = buf.slice(0, sep).toString('utf8');
      const st = +(head.match(/HTTP\/1\.[01] (\d+)/) || [0, 0])[1];
      cb(null, { status: st, head, body: buf.slice(sep + 4) });
    });
    t.on('error', cb);
  });
}

const targets = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
let i = 0;
(function next() {
  if (i >= targets.length) return console.log('done');
  const rel = targets[i++];
  get(BASE + rel, (err, r) => {
    if (err) { console.log('FAIL ' + rel + ': ' + err.message); return next(); }
    const dest = path.join(OUT, rel.replace(/\//g, path.sep));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, r.body);
    console.log(rel + ' -> status=' + r.status + ' bytes=' + r.body.length);
    next();
  });
})();