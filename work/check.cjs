const fs = require('fs');
global.window = {};
eval(fs.readFileSync('assets/js/i18n.js', 'utf8'));
const T = window.I18N;
const pages = ['index.html','the-atlas.html','location.html','sales-info.html','media.html','privacy.html','vr.html'];
let bad = 0;
function dig(o, p) { return p.split('.').reduce((a, k) => a && a[k], o); }
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8');
  const keys = [...h.matchAll(/data-i18n(?:-list)?="([^"]+)"/g)].map(m => m[1]);
  for (const l of Object.keys(T)) {
    for (const k of keys) {
      if (dig(T[l], k) === undefined) { console.log('MISSING', f, l, k); bad++; }
    }
  }
}
// relative link check（wa.me 与 720vr 外部链接为预期例外）
for (const f of pages) {
  const h = fs.readFileSync(f, 'utf8');
  for (const m of h.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (u.startsWith('https://wa.me/') || u.startsWith('https://720vr.midland.com.hk/')) continue;
    if (/^(https?:|\/)/.test(u)) { console.log('NON-RELATIVE', f, u); bad++; }
    else if (!fs.existsSync(u) && !u.startsWith('#')) { console.log('BROKEN', f, u); bad++; }
  }
}
console.log(bad ? bad + ' problems' : 'ALL CHECKS PASSED');
