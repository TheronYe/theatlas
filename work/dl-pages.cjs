// 下载 6 个语言版本的 the-atlas / location 页面原始 HTML
const https = require('https');
const fs = require('fs');
const http = require('http');

const urls = [
  ['tc-atlas', 'https://www.theatlas.hk/phase1/the-atlas'],
  ['tc-location', 'https://www.theatlas.hk/phase1/location'],
  ['sc-atlas', 'https://www.theatlas.hk/zh-cn/phase1/the-atlas'],
  ['sc-location', 'https://www.theatlas.hk/zh-cn/phase1/location'],
  ['en-atlas', 'https://www.theatlas.hk/en/phase1/the-atlas'],
  ['en-location', 'https://www.theatlas.hk/en/phase1/location']
];

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' } }, (res) => {
      const ch = [];
      res.on('data', c => ch.push(c));
      res.on('end', () => resolve(Buffer.concat(ch)));
    }).on('error', reject);
  });
}

(async () => {
  for (const [name, url] of urls) {
    try {
      const buf = await get(url);
      const file = 'work/src-' + name + '.html';
      fs.writeFileSync(file, buf);
      console.log(name, 'OK', buf.length);
    } catch (e) {
      console.log(name, 'FAIL', e.message);
    }
  }
})();