// 将 Next.js SSR 页面转为纯文本，便于提取文案
const fs = require('fs');

const files = ['tc-atlas', 'tc-location', 'sc-atlas', 'sc-location', 'en-atlas', 'en-location'];

for (const f of files) {
  let s = fs.readFileSync('work/src-' + f + '.html', 'utf8');
  // 去除 script/style/svg/noscript
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
       .replace(/<style[\s\S]*?<\/style>/gi, '')
       .replace(/<svg[\s\S]*?<\/svg>/gi, '')
       .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
  // 块级标签转换行
  s = s.replace(/<\/(?:p|div|section|h1|h2|h3|h4|li|figcaption|summary|blockquote|tr)>/gi, '\n');
  s = s.replace(/<(?:br|hr)\s*\/?>/gi, '\n');
  // 去除其余标签
  s = s.replace(/<[^>]+>/g, '');
  // HTML 实体
  s = s.replace(/&nbsp;/g, ' ').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
       .replace(/"/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
  // 压缩空白
  s = s.split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(l => l.length > 0).join('\n');
  fs.writeFileSync('work/txt-' + f + '.txt', s, 'utf8');
  console.log(f, '->', s.length, 'chars,', s.split('\n').length, 'lines');
}