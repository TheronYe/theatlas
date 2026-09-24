// VR 站点镜像下载器：先抓入口页，解析资源引用，再递归下载
const net = require('net');
const tls = require('tls');
const fs = require('fs');
const path = require('path');

const PROXY = { host: '127.0.0.1', port: 10808 };
const HOST = '720vr.midland.com.hk';
const BASE = '/vr/KL/%E6%93%8E%E6%B5%B7/';
const OUT = path.join(__dirname, '..', 'assets', 'vr', 'midland');

function socksConnect(targetHost, targetPort, cb) {
  const sock = net.connect(PROXY.port, PROXY.host, () => sock.write(Buffer.from([0x05, 0x01, 0x00])));
  let state = 0;
  const onData = (d) => {
    if (state === 0) {
      if (d[0] !== 0x05 || d[1] !== 0x00) return cb(new Error('SOCKS handshake'));
      const hb = Buffer.from(targetHost, 'utf8');
      state = 1;
      sock.write(Buffer.concat([Buffer.from([0x05, 0x01, 0x00, 0x03, hb.length]), hb,
        Buffer.from([(targetPort >> 8) & 0xff, targetPort & 0xff])]));
    } else if (state === 1) {
      if (d[1] !== 0x00) return cb(new Error('SOCKS connect code=' + d[1]));
      sock.removeListener('data', onData);
      sock.setTimeout(0);
      cb(null, sock);
    }
  };
  sock.on('data', onData);
  sock.on('error', cb);
  sock.setTimeout(30000, () => cb(new Error('timeout')));
}

function get(rawPath, cb) {
  socksConnect(HOST, 443, (err, sock) => {
    if (err) return cb(err);
    const t = tls.connect({ socket: sock, servername: HOST, rejectUnauthorized: false }, () => {
      t.write('GET ' + rawPath + ' HTTP/1.1\r\nHost: ' + HOST + '\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nConnection: close\r\n\r\n');
    });
    const chunks = [];
    t.on('data', (c) => chunks.push(c));
    t.on('end', () => {
      const buf = Buffer.concat(chunks);
      const sep = buf.indexOf('\r\n\r\n');
      if (sep === -1) return cb(new Error('bad response'));
      const head = buf.slice(0, sep).toString('utf8');
      const body = buf.slice(sep + 4);
      const m = head.match(/HTTP\/1\.[01] (\d+)/);
      cb(null, { status: m ? +m[1] : 0, head, body });
    });
    t.on('error', cb);
  });
}

fs.mkdirSync(OUT, { recursive: true });
get(BASE + 'index.html', (err, r) => {
  if (err) return console.log('ENTRY FAIL: ' + err.message);
  console.log('entry status=' + r.status + ' bytes=' + r.body.length);
  fs.writeFileSync(path.join(OUT, 'index.html'), r.body);
  const html = r.body.toString('utf8');
  const refs = new Set();
  const re = /(?:src|href|data-\w+|url\()\s*=?\s*["'(]?([^"')>\s]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    let u = m[1];
    if (/^(https?:)?\/\//.test(u) || u.startsWith('data:') || u.startsWith('#')) continue;
    refs.add(u);
  }
  console.log('--- refs (' + refs.size + ') ---');
  [...refs].forEach((x) => console.log('  ' + x));
});