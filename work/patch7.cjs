// 更新 vr.placeholder 三语（原为内置查看器说明，改为外部网站说明）
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const repl = [
  ['      placeholder: "如畫面顯示測試網格，表示正式全景圖尚未提供；請將 2:1 比例全景圖（JPG / WebP）放入 assets/vr/ 目錄後即會自動載入。"',
   '      placeholder: "720° VR 內容由外部網站（720vr.midland.com.hk）提供；如該網站暫時無法載入全景圖，請稍後再試。"'],
  ['      placeholder: "如画面显示测试网格，表示正式全景图尚未提供；请将 2:1 比例全景图（JPG / WebP）放入 assets/vr/ 目录后即会自动载入。"',
   '      placeholder: "720° VR 内容由外部网站（720vr.midland.com.hk）提供；如该网站暂时无法加载全景图，请稍后再试。"'],
  ['      placeholder: "If a test grid is shown, the official panorama is not yet available; place a 2:1 equirectangular image (JPG / WebP) into assets/vr/ and it will load automatically."',
   '      placeholder: "The 720° VR content is provided by an external website (720vr.midland.com.hk); if the panorama fails to load there, please try again later."']
];

let ok = 0;
repl.forEach(function (r) {
  if (s.indexOf(r[0]) === -1) { console.log('MISSING:', r[0].slice(0, 60)); return; }
  s = s.replace(r[0], r[1]);
  ok++;
});
fs.writeFileSync(p, s, 'utf8');
console.log('replaced:', ok, '/', repl.length);