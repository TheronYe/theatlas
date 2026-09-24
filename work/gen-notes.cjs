// 从 txt 文件生成 i18n-notes.js（atlas 7 条 + location 20 条附注，三语）
const fs = require('fs');

function extractNotes(file, marker) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  for (const l of lines) {
    if (l.indexOf(marker) === 0 && l.indexOf('｜2.') !== -1) {
      // 按编号分割：1.xxx｜2.xxx｜3.xxx
      const parts = l.split('｜');
      const notes = [];
      let cur = '';
      for (const p of parts) {
        if (/^\d+\./.test(p.trim())) {
          if (cur) notes.push(cur.trim());
          cur = p.trim();
        } else {
          cur += '｜' + p;
        }
      }
      if (cur) notes.push(cur.trim());
      return notes;
    }
  }
  return null;
}

const atlasTC = extractNotes('work/txt-tc-atlas.txt', '1.發展項目會所');
const atlasSC = extractNotes('work/txt-sc-atlas.txt', '1.发展项目会所');
const atlasEN = extractNotes('work/txt-en-atlas.txt', '1.');
const locTC = extractNotes('work/txt-tc-location.txt', '1.所述之景觀');
const locSC = extractNotes('work/txt-sc-location.txt', '1.所述之景观');
const locEN = extractNotes('work/txt-en-location.txt', '1.The views described');

// EN atlas 附注定位（可能以不同文字开头）
let atlasEN2 = atlasEN;
if (!atlasEN2 || atlasEN2.length < 5) {
  const lines = fs.readFileSync('work/txt-en-atlas.txt', 'utf8').split('\n');
  for (const l of lines) {
    if (l.indexOf('｜2.') !== -1 && l.indexOf('clubhouse') !== -1) {
      const parts = l.split('｜');
      const notes = []; let cur = '';
      for (const p of parts) {
        if (/^\d+\./.test(p.trim())) { if (cur) notes.push(cur.trim()); cur = p.trim(); }
        else cur += '｜' + p;
      }
      if (cur) notes.push(cur.trim());
      atlasEN2 = notes; break;
    }
  }
}

console.log('atlas notes:', 'TC=' + (atlasTC ? atlasTC.length : 0), 'SC=' + (atlasSC ? atlasSC.length : 0), 'EN=' + (atlasEN2 ? atlasEN2.length : 0));
console.log('loc notes:', 'TC=' + (locTC ? locTC.length : 0), 'SC=' + (locSC ? locSC.length : 0), 'EN=' + (locEN ? locEN.length : 0));

if (!atlasTC || !atlasSC || !atlasEN2 || !locTC || !locSC || !locEN) {
  console.log('EXTRACTION FAILED'); process.exit(1);
}

const J = (s) => JSON.stringify(s.replace(/"/g, '"').replace(/&/g, '&').replace(/&#39;/g, "'"));
let out = '/* THE ATLAS 擎海 — 页面附注（i18n-notes）：由官方页面脚注生成，仅 the-atlas / location 页加载 */\n';
out += 'window.I18N_NOTES = {\n';
for (const [key, a, l] of [['zh-hk', atlasTC, locTC], ['zh-cn', atlasSC, locSC], ['en', atlasEN2, locEN]]) {
  out += '  "' + key + '": {\n';
  out += '    atlas: [\n' + a.map(n => '      ' + J(n)).join(',\n') + '\n    ],\n';
  out += '    location: [\n' + l.map(n => '      ' + J(n)).join(',\n') + '\n    ]\n';
  out += '  },\n';
}
out += '};\n';
fs.writeFileSync('assets/js/i18n-notes.js', out, 'utf8');
console.log('i18n-notes.js written:', out.length, 'chars');