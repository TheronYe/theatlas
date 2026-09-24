// 补入 home.scrollCue（hero 向下浏览提示）
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const cues = { 'zh-hk': '向下瀏覽', 'zh-cn': '向下浏览', 'en': 'Scroll' };
const envAnchors = {
  'zh-hk': '      envTitle: "環境照片",',
  'zh-cn': '      envTitle: "环境照片",',
  'en': '      envTitle: "Environment Photos",'
};
Object.keys(envAnchors).forEach(function (lang) {
  const a = envAnchors[lang];
  if (s.indexOf(a) === -1) { console.log(lang, 'anchor missing'); return; }
  s = s.replace(a, a + '\n      scrollCue: ' + JSON.stringify(cues[lang]) + ',');
});

fs.writeFileSync(p, s, 'utf8');
console.log('scrollCue:', (s.match(/scrollCue:/g) || []).length);