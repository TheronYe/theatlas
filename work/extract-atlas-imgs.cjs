// 从 atlas 原始 HTML 提取「设施图片 → 设施名」有序配对 + 其他图片
const fs = require('fs');
const h = fs.readFileSync('work/src-tc-atlas.html', 'utf8');

// 交替匹配 img src 与后续英文+中文名
const re = /<img[^>]+src="(\/api\/media\/file\/[^"]+)"[^>]*>|([A-Z][A-Z'&\.\- ]{3,30}) ([一-龥]{2,6})</g;
const pairs = [];
let lastSrc = null, m;
while ((m = re.exec(h)) !== null) {
  if (m[1]) { lastSrc = m[1]; }
  else if (m[2] && lastSrc) {
    pairs.push({ src: lastSrc, en: m[2].trim(), zh: m[3] });
    lastSrc = null;
  }
}
console.log('facility pairs:', pairs.length);
pairs.forEach(p => console.log(p.en + ' ' + p.zh + '  <-  ' + p.src));

// 其他关键图片
console.log('\n--- all api images (unique, ordered) ---');
const seen = new Set();
for (const mm of h.matchAll(/src="(\/api\/media\/file\/[^"]+)"/g)) {
  if (!seen.has(mm[1])) { seen.add(mm[1]); console.log(mm[1]); }
}