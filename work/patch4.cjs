// 补入 home.envTitle（照片墙标题）与 vr.open / vr.openNote（VR 跳转按钮）
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

// 1) home.envTitle —— 插在 discSummary 前
const envTitles = {
  'zh-hk': '環境照片',
  'zh-cn': '环境照片',
  'en': 'Environment Photos'
};
const discSummaries = {
  'zh-hk': '繪畫圖像',
  'zh-cn': '绘画图像',
  'en': 'Artist’s Impression'
};
Object.keys(discSummaries).forEach(function (lang) {
  const anchor = 'home: {\n      discSummary: ' + JSON.stringify(discSummaries[lang]) + ',';
  const ins = 'home: {\n      envTitle: ' + JSON.stringify(envTitles[lang]) + ',\n      discSummary: ' + JSON.stringify(discSummaries[lang]) + ',';
  if (s.indexOf(anchor) === -1) { console.log(lang, 'home anchor missing'); return; }
  s = s.replace(anchor, ins);
});

// 2) vr.open / vr.openNote —— 插在 vr.title 后
const openLabels = {
  'zh-hk': ['開啟 720° VR 漫遊', '（將開啟本站內置的本地漫遊檔案）'],
  'zh-cn': ['开启 720° VR 漫游', '（将开启本站内置的本地漫游文件）'],
  'en': ['Open 720° VR Tour', '(opens the built-in local tour file on this site)']
};
const vrTitleLines = {
  'zh-hk': '      title: "720° VR",\n      sub: "網上睇樓",',
  'zh-cn': '      title: "720° VR",\n      sub: "网上看楼",',
  'en': '      title: "720° VR",\n      sub: "Virtual Tour",'
};
Object.keys(vrTitleLines).forEach(function (lang) {
  const a = vrTitleLines[lang];
  if (s.indexOf(a) === -1) { console.log(lang, 'vr anchor missing'); return; }
  const ins = a + '\n      open: ' + JSON.stringify(openLabels[lang][0]) + ',\n      openNote: ' + JSON.stringify(openLabels[lang][1]) + ',';
  s = s.replace(a, ins);
});

fs.writeFileSync(p, s, 'utf8');
console.log('envTitle:', (s.match(/envTitle:/g) || []).length);
console.log('vr.open:', (s.match(/      open: /g) || []).length);