// 通用 SOCKS5 代理下载工具
const net = require('net');
const tls = require('tls');

const PROXY = { host: '127.0.0.1', port: 10808 };

function socksConnect(h, p, cb) {
  const s = net.connect(PROXY.port, PROXY.host, () => s.write(Buffer.from([5, 1, 0])));
  let st = 0;
  const onData = (d) => {
    if (st === 0) {
      if (d[0] !== 5 || d[1] !== 0) return cb(new Error('socks handshake'));
      const hb = Buffer.from(h, 'utf8');
      st = 1;
      s.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([(p >> 8) & 255, p & 255])]));
    } else if (st === 1) {
      if (d[1] !== 0) return cb(new Error('socks code=' + d[1]));
      s.removeListener('data', onData); s.setTimeout(0); cb(null, s);
    }
  };
  s.on('data', onData); s.on('error', cb);
  s.setTimeout(30000, () => cb(new Error('timeout')));
}

function get(host, rawPath, cb) {
  socksConnect(host, 443, (err, sock) => {
    if (err) return cb(err);
    const t = tls.connect({ socket: sock, servername: host, rejectUnauthorized: false, timeout: 60000 }, () => {
      t.write('GET ' + rawPath + ' HTTP/1.1\r\nHost: ' + host + '\r\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\nAccept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8\r\nAccept-Language: zh-CN,zh;q=0.9,en;q=0.8\r\nConnection: close\r\nCache-Control: max-age=0\r\n\r\n');
    });
    const ch = [];
    t.on('data', (c) => ch.push(c));
    t.on('end', () => {
      const buf = Buffer.concat(ch);
      const sep = buf.indexOf('\r\n\r\n');
      if (sep === -1) return cb(new Error('bad response'));
      const head = buf.slice(0, sep).toString('utf8');
      const st = +(head.match(/HTTP\/1\.[01] (\d+)/) || [0, 0])[1];
      const body = buf.slice(sep + 4);
      cb(null, { status: st, head, body });
    });
    t.on('error', cb);
    t.setTimeout(60000, () => t.destroy());
  });
}

function download(host, rawPath) {
  return new Promise((resolve, reject) => {
    get(host, rawPath, (err, r) => err ? reject(err) : resolve(r));
  });
}

module.exports = { download, get, socksConnect };
