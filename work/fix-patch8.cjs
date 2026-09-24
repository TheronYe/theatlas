// 修复 patch8 造成的块尾缺逗号：}\n    location/sales: {  →  },\n    ...
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const before = (s.match(/\n        \}\n    (?:location|sales): \{/g) || []).length;
s = s.replace(/\n        \}\n(?=    (?:location|sales): \{)/g, '\n    },\n');
const after = (s.match(/\n        \}\n    (?:location|sales): \{/g) || []).length;

fs.writeFileSync(p, s, 'utf8');
console.log('repaired closings:', before, '->', after);