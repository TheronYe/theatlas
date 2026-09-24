// 漫游包所需的资源：更多 js 与全景切片下载
const fs = require('fs');
const path = require('path');
const { download } = require('./utils-proxy.cjs');

const HOST = '720vr.midland.com.hk';
const OUT = path.join(__dirname, '..', 'assets', 'vr', 'tour');

// 需要下载的公共资源文件
const files = [
  'player/krp_player_1.20.9.js',
  'player/krp_viewer.js',
  'player/tueng0.png',
  'assets/default/crosshair.png',
  'assets/default/embed_logo.png',
  'assets/default/full_icon.png',
  'assets/default/hotspot_icon.png',
  'assets/default/map.png',
  'assets/default/radar.png',
  'assets/default/suchart.png',
  'assets/default/vr_btn_icon.png',
  'assets/default/overlay.png'
];

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  for (const rel of files) {
    try {
      const r = await download(HOST, `/${rel}`);
      if (r.status === 200 && r.body.length > 0) {
        const dest = path.join(OUT, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, r.body);
        console.log(`${rel} -> ${r.status}, ${r.body.length} B`);
      } else {
        console.log(`${rel} -> status=${r.status}, len=${r.body.length}`);
      }
    } catch (e) {
      console.log(`${rel} -> ERR ${e.message}`);
    }
  }
  console.log('done');
})();
