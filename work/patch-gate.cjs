// 为 i18n.js 三语块补入 gate 与 hero.info 文案
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const gates = { 'zh-hk': '進入', 'zh-cn': '进入', 'en': 'Enter' };

// 在 legal 块之后、footer 之前插入 gate
Object.keys(gates).forEach(function (lang) {
  const label = gates[lang];
  const re = new RegExp('(    legal: \\{[\\s\\S]*?\\n    \\},\\n)(    footer: \\{)');
  s = s.replace(re, function (m, legalBlock, footerStart) {
    return legalBlock + '    gate: {\n      enter: ' + JSON.stringify(label) + '\n    },\n' + footerStart;
  });
});

fs.writeFileSync(p, s, 'utf8');
console.log('gate blocks:', (s.match(/    gate: \{/g) || []).length);