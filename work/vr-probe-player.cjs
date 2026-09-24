// 单文件测试，看能否下载 krpano 播放器
const { download } = require('./utils-proxy.cjs');

const HOST = '720vr.midland.com.hk';
const candidates = [
  '/player/krp_player_1.20.9.js',
  '/assets/player/krp_player_1.20.9.js',
  '/krpano/krpano.js',
  '/js/krpano.js',
  '/player/krp_viewer.js',
  '/assets/player/krpano.js'
];

(async () => {
  console.log('start');
  for (const p of candidates) {
    try {
      const r = await download(HOST, p);
      console.log(p, '->', r.status, r.body.length, 'B');
    } catch (e) {
      console.log(p, '-> ERR:', e.message);
    }
  }
  console.log('end');
  process.exit(0);
})();
