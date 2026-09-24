// 通过 SOCKS5 代理用 Node(OpenSSL) 访问 VR 站点，评估可下载资源
const net = require('net');
const tls = require('tls');
const http = require('http');
const PROXY = { host: '127.0.0.1', port: 10808 };
const HOST = '720vr.midland.com.hk';

function socksConnect(targetHost, targetPort, cb) {
  const sock = net.connect(PROXY.port, PROXY.host, () => {
    sock.write(Buffer.from([0x05, 0x01, 0x00]));
  });
  let state = 0;
  sock.on('data', function onData(d) {
    if (state === 0) {
      if (d[0] !== 0x05 || d[1] !== 0x00) return cb(new Error('SOCKS5 handshake failed'));
      const hb = Buffer.from(targetHost, 'utf8');
      const req = Buffer.concat([
        Buffer.from([0x05, 0x01, 0x00, 0x03, hb.length]), hb,
        Buffer.from([(targetPort >> 8) & 0xff, targetPort & 0xff])
      ]);
      state = 1;
      sock.write(req);
    } else if (state === 1) {
      if (d[1] !== 0x00) return cb(new Error('SOCKS5 connect failed code=' + d[1]));
      sock.removeListener('data', onData);
      cb(null, sock);
    }
  });
  sock.on('error', cb);
  sock.setTimeout(30000, () => cb(new Error('timeout')));
}

function fetchOnce(path, useTls, cb) {
  socksConnect(HOST, useTls ? 443 : 80, (err, sock) => {
    if (err) return cb(err);
    const onConn = (s) => {
      s.write('GET ' + path + ' HTTP/1.1\r\nHost: ' + HOST + '\r\nUser-Agent: Mozilla/5.0\r\nAccept: */*\r\nConnection: close\r\n\r\n');
      const chunks = [];
      s.on('data', (c) => chunks.push(c));
      s.on('end', () => cb(null, Buffer.concat(chunks)));
      s.on('error', cb);
    };
    if (useTls) {
      const t = tls.connect({ socket: sock, servername: HOST, rejectUnauthorized: false }, () => onConn(t));
      t.on('error', cb);
    } else onConn(sock);
  });
}

const path = process.argv[2] || '/';
fetchOnce(path, true, (err, buf) => {
  if (err) {
    console.log('HTTPS FAIL: ' + err.message);
    fetchOnce(path, false, (e2, b2) => {
      if (e2) return console.log('HTTP FAIL: ' + e2.message);
      const s = b2.toString('utf8');
      console.log('HTTP OK len=' + s.length);
      console.log(s.split('\r\n').slice(0, 12).join('\n'));
    });
    return;
  }
  const s = buf.toString('utf8');
  console.log('HTTPS OK len=' + s.length);
  console.log(s.split('\r\n').slice(0, 12).join('\n'));
});