// 修正：为缺 gate 的语言块补入 gate（按语言顺序精确插入）
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const labels = { 'zh-hk': '進入', 'zh-cn': '进入', 'en': 'Enter' };

// 逐个语言块处理：定位 "    legal: {" ... "    footer: {" 之间
['zh-hk', 'zh-cn', 'en'].forEach(function (lang) {
  const label = labels[lang];
  const legalIdx = s.indexOf('    legal: {');
  if (legalIdx === -1) { console.log(lang, 'legal not found'); return; }

  // 找到该 legal 块对应的 footer 起点（从 legalIdx 之后第一个 "    footer: {"）
  // 需按语言分别定位：zh-hk 是第一个 legal，zh-cn 第二个，en 第三个
  const order = { 'zh-hk': 0, 'zh-cn': 1, 'en': 2 };
  const n = order[lang];
  let idx = -1, count = 0, from = 0;
  while (count <= n) {
    idx = s.indexOf('    legal: {', from);
    if (idx === -1) break;
    count++;
    from = idx + 1;
  }
  if (idx === -1) { console.log(lang, 'legal block', n, 'not found'); return; }

  const footerIdx = s.indexOf('    footer: {', idx);
  if (footerIdx === -1) { console.log(lang, 'footer after legal not found'); return; }

  const between = s.slice(idx, footerIdx);
  if (between.indexOf('    gate: {') !== -1) { console.log(lang, 'gate already present'); return; }

  const insert = '    gate: {\n      enter: ' + JSON.stringify(label) + '\n    },\n';
  s = s.slice(0, footerIdx) + insert + s.slice(footerIdx);
  console.log(lang, 'gate inserted');
});

fs.writeFileSync(p, s, 'utf8');
console.log('total gate blocks:', (s.match(/    gate: \{/g) || []).length);