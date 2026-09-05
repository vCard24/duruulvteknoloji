/** One-off helper: node scripts/_extract-blog-meta.js */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const out = [];
for (const ent of fs.readdirSync(path.join(ROOT, 'blog'), { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const slug = ent.name;
  const h = fs.readFileSync(path.join(ROOT, 'blog', slug, 'index.html'), 'utf8');
  const pick = (re) => {
    const m = h.match(re);
    return m ? m[1].trim() : '';
  };
  const h2 = [...h.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map((m) => ({
    id: m[1],
    tr: m[2],
  }));
  const faqs = [];
  const faqRe =
    /<button[^>]*class="accordion__trigger"[^>]*>([^<]+)<[\s\S]*?<div class="accordion__content">([\s\S]*?)<\/div>/g;
  let fm;
  while ((fm = faqRe.exec(h))) {
    faqs.push({
      q: fm[1].trim(),
      a: fm[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    });
  }
  out.push({
    slug,
    titleTr: pick(/<h1>([^<]+)<\/h1>/),
    descTr: pick(/name="description" content="([^"]*)"/),
    tagTr: pick(/blog-hero__tag">([^<]+)/),
    dateTr: pick(/blog-icon--meta"><[\s\S]*?<\/svg>\s*([^<]+)/),
    readTr: (() => {
      const metas = [...h.matchAll(/blog-icon--meta"><[\s\S]*?<\/svg>\s*([^<]+)/g)].map((m) =>
        m[1].trim()
      );
      return metas[1] || '';
    })(),
    author: pick(/blog-icon--meta"><[\s\S]*?<\/svg>\s*(Hacı[^<]*)/) || 'Hacı DURUÖZ',
    cover: pick(/assets\/img\/blog\/([^"]+)/),
    datePublished: pick(/"datePublished":"([^"]+)"/),
    h2,
    faqs,
  });
}
fs.writeFileSync(path.join(ROOT, 'scripts', '_blog-meta.json'), JSON.stringify(out, null, 2));
console.log('wrote', out.length, 'posts');
