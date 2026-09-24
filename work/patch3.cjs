// 任务：1) 首页第4张卡片文案 2) VR 内置页文案 3) media.vrNote 改为内置说明
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

// --- 1) home.s4 三语 ---
s = s.replace(
  '      s3k: "位置概覽", s3t: "海濱生活 · 交通網絡",\n      s3d: "毗鄰港鐵油塘站及東區海底隧道，往返港島東及九龍東核心商業區便捷。",',
  '      s3k: "位置概覽", s3t: "海濱生活 · 交通網絡",\n      s3d: "毗鄰港鐵油塘站及東區海底隧道，往返港島東及九龍東核心商業區便捷。",\n      s4k: "媒體資料庫", s4t: "環境照片 · 720° VR",\n      s4d: "瀏覽項目周邊環境照片、宣傳圖像，以及本站內置的 720° VR 網上睇樓。",'
);
s = s.replace(
  '      s3k: "位置概览", s3t: "海滨生活 · 交通网络",\n      s3d: "毗邻港铁油塘站及东区海底隧道，往返港岛东及九龙东核心商业区便捷。",',
  '      s3k: "位置概览", s3t: "海滨生活 · 交通网络",\n      s3d: "毗邻港铁油塘站及东区海底隧道，往返港岛东及九龙东核心商业区便捷。",\n      s4k: "媒体资料库", s4t: "环境照片 · 720° VR",\n      s4d: "浏览项目周边环境照片、宣传图像，以及本站内置的 720° VR 网上看楼。",'
);
s = s.replace(
  '      s3k: "Location", s3t: "Waterfront Living · Connectivity",\n      s3d: "Close to MTR Yau Tong Station and the Eastern Harbour Crossing, with convenient access to Hong Kong Island East and Kowloon East business districts.",',
  '      s3k: "Location", s3t: "Waterfront Living · Connectivity",\n      s3d: "Close to MTR Yau Tong Station and the Eastern Harbour Crossing, with convenient access to Hong Kong Island East and Kowloon East business districts.",\n      s4k: "Media Library", s4t: "Photos · 720° VR",\n      s4d: "Browse surrounding photos, promotional images, and the built-in 720° VR virtual tour on this site.",'
);

// --- 2) media.vrNote 改为内置说明 ---
s = s.replace('      vrNote: "（外部連結，將於新視窗開啟）",',
              '      vrNote: "（本站內置瀏覽，無需跳轉）",');
s = s.replace('      vrNote: "（外部链接，将于新窗口打开）",',
              '      vrNote: "（本站内置浏览，无需跳转）",');
s = s.replace('      vrNote: "(external link, opens in a new tab)",',
              '      vrNote: "(built-in viewer, no redirect)",');

// --- 3) 各语言 media 块后插入 vr 区块 ---
const vrBlocks = {
  hk: '    vr: {\n      title: "720° VR",\n      sub: "網上睇樓",\n      p1: "拖曳畫面即可環視單位及屋苑環境，無需跳轉至外部網站。",\n      hint: "拖曳環視 · 滾輪縮放",\n      placeholder: "如畫面顯示測試網格，表示正式全景圖尚未提供；請將 2:1 比例全景圖（JPG / WebP）放入 assets/vr/ 目錄後即會自動載入。"\n    },\n',
  cn: '    vr: {\n      title: "720° VR",\n      sub: "网上看楼",\n      p1: "拖拽画面即可环视单位及屋苑环境，无需跳转至外部网站。",\n      hint: "拖拽环视 · 滚轮缩放",\n      placeholder: "如画面显示测试网格，表示正式全景图尚未提供；请将 2:1 比例全景图（JPG / WebP）放入 assets/vr/ 目录后即会自动载入。"\n    },\n',
  en: '    vr: {\n      title: "720° VR",\n      sub: "Virtual Tour",\n      p1: "Drag to look around the unit and the surroundings — no external redirect needed.",\n      hint: "Drag to look around · Scroll to zoom",\n      placeholder: "If a test grid is shown, the official panorama is not yet available; place a 2:1 equirectangular image (JPG / WebP) into assets/vr/ and it will load automatically."\n    },\n'
};
const anchors = [
  ['      disclaimer: "任何圖像均為想像圖 / 電腦修飾圖像，僅供參考，不構成任何要約、承諾、陳述或保證。"\n    },\n', vrBlocks.hk],
  ['      disclaimer: "任何图像均为想像图 / 电脑修饰图像，仅供参考，不构成任何要约、承诺、陈述或保证。"\n    },\n', vrBlocks.cn],
  ['      disclaimer: "All images are artist’s impressions / computer-edited images for reference only and do not constitute any offer, undertaking, representation or warranty."\n    },\n', vrBlocks.en]
];
anchors.forEach(function (a) {
  if (s.indexOf(a[0]) === -1) { console.log('ANCHOR MISSING:', a[0].slice(0, 40)); return; }
  s = s.replace(a[0], a[0] + a[1]);
});

fs.writeFileSync(p, s, 'utf8');
console.log('s4:', (s.match(/s4k:/g) || []).length,
            '| vrNote-new:', (s.match(/内置浏览|內置瀏覽|built-in viewer/g) || []).length,
            '| vr blocks:', (s.match(/    vr: \{/g) || []).length);