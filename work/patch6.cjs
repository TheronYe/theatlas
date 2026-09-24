// VR 改为外部跳转：更新 vr.p1 / vr.openNote / media.vrNote 三语文案
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const repl = [
  // vr.p1
  ['      p1: "拖曳畫面即可環視單位及屋苑環境，無需跳轉至外部網站。",',
   '      p1: "點擊以下按鈕即可前往 720° VR 網上睇樓（於新視窗開啟）。",'],
  ['      p1: "拖拽画面即可环视单位及屋苑环境，无需跳转至外部网站。",',
   '      p1: "点击以下按钮即可前往 720° VR 网上看楼（在新窗口打开）。",'],
  ['      p1: "Drag to look around the unit and the surroundings — no external redirect needed.",',
   '      p1: "Click the button below to open the 720° VR virtual tour in a new window.",'],
  // vr.openNote
  ['      openNote: "（將開啟本站內置的本地漫遊檔案）",',
   '      openNote: "（外部連結：720vr.midland.com.hk，將於新視窗開啟）",'],
  ['      openNote: "（将开启本站内置的本地漫游文件）",',
   '      openNote: "（外部链接：720vr.midland.com.hk，将在新窗口打开）",'],
  ['      openNote: "(opens the built-in local tour file on this site)",',
   '      openNote: "(external link: 720vr.midland.com.hk, opens in a new window)",'],
  // media.vrNote
  ['      vrNote: "（本站內置瀏覽，無需跳轉）",',
   '      vrNote: "（將於新視窗開啟 720vr 網站）",'],
  ['      vrNote: "（本站内置浏览，无需跳转）",',
   '      vrNote: "（将在新窗口打开 720vr 网站）",'],
  ['      vrNote: "(built-in viewer, no redirect)",',
   '      vrNote: "(opens the 720vr website in a new window)",']
];

let ok = 0;
repl.forEach(function (r) {
  if (s.indexOf(r[0]) === -1) { console.log('MISSING:', r[0].slice(0, 50)); return; }
  s = s.replace(r[0], r[1]);
  ok++;
});

fs.writeFileSync(p, s, 'utf8');
console.log('replaced:', ok, '/', repl.length);