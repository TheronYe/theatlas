// 下载 krpano 播放器 + 首个场景的全景预览图（大分辨率 preview.jpg）
const fs = require('fs');
const path = require('path');
const { download } = require('./utils-proxy.cjs');

const HOST = '720vr.midland.com.hk';
const OUT = path.join(__dirname, '..', 'assets', 'vr', 'tour');

const files = [
  'player/krp_player_1.20.9.js',
  // 首个场景 33626151 的全景切片（krpano 多分辨率通常是 level 0~n 的 12/24 块）
  'resource/prod/19ai59787r6/7752ecakxns/94549772/imgs/preview.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/imgs/thumb.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/scene/0/prv.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/scene/0/preview.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/scene/0/thumbs/f_b_0_0.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/scene/0/thumbs/f_b_1_0.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/scene/0/thumbs/f_b_0_1.jpg',
  'resource/prod/19ai59787r6/7752ecakxns/94549772/scene/0/thumbs/f_b_1_1.jpg'
];

(async () => {
  for (const rel of files) {
    try {
      const r = await download(HOST, '/' + rel);
      if (r.status === 200 && r.body.length > 0) {
        const dest = path.join(OUT, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, r.body);
        console.log(`${rel} -> ${r.status}, ${r.body.length} B`);
      } else {
        console.log(`${rel} -> ${r.status} (${r.body.length} B, ${r.head.split('\r\n')[0]})`);
      }
    } catch (e) {
      console.log(`${rel} -> ERR ${e.message}`);
    }
  }
  console.log('done');
})();
