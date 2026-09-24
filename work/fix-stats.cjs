// 修复 stats 中被序列化为空对象的数字：[ {}, "分鐘", ... ] → [ 6, "分鐘", ... ]
const fs = require('fs');
const p = 'assets/js/i18n.js';
let s = fs.readFileSync(p, 'utf8');

const seq = [6, 8, 12, 17, 160, 16]; // 每组 stats 的目标值（三组语言相同）
let i = 0;
s = s.replace(/\[\s*\{\s*\},\s*"/g, function () {
  const n = seq[i % seq.length];
  i++;
  return '[ ' + n + ', "';
});

fs.writeFileSync(p, s, 'utf8');
console.log('replaced numbers:', i);