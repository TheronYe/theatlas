// 扫描全站 HTML/CSS/JS 中的资源引用，检查是否为相对路径
const fs = require('fs');
const path = require('path');

const siteFiles = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'work' && e.name !== 'node_modules') walk(p); }
    else if (/\.(html|css|js)$/i.test(e.name)) siteFiles.push(p);
  }
}
walk('.');

let bad = 0;
for (const f of siteFiles) {
  const c = fs.readFileSync(f, 'utf8');
  // HTML src/href
  for (const m of c.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (u.startsWith('//') || /^https?:\/\//i.test(u) || u.startsWith('/')) {
      console.log('ABS', f, u);
      bad++;
    }
  }
  // CSS url()
  for (const m of c.matchAll(/url\(([^)]+)\)/g)) {
    const u = m[1].replace(/^['"]|['"]$/g, '');
    if (u && !u.startsWith('data:') && (u.startsWith('/') || /^https?:\/\//i.test(u) || u.startsWith('//'))) {
      console.log('ABS-CSS', f, u);
      bad++;
    }
  }
}
console.log(bad ? bad + ' absolute refs' : 'ALL RELATIVE OK');
console.log('scanned files:', siteFiles.length);