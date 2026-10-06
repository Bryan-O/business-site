// Builds the site: src/pages/*.html + src/partials/layout.html + public/* -> dist/
// Usage: node build.js   (no dependencies)
const fs = require('fs');
const path = require('path');

const root = __dirname;
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/site.json'), 'utf8'));
const layout = fs.readFileSync(path.join(root, 'src/partials/layout.html'), 'utf8');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const f of fs.readdirSync(path.join(root, 'public'))) {
  fs.copyFileSync(path.join(root, 'public', f), path.join(dist, f));
}

for (const page of site.pages) {
  const src = path.join(root, 'src/pages', page.file);
  if (!fs.existsSync(src)) throw new Error('Missing page source: ' + src);
  const nav = site.nav.map(([href, label]) =>
    `<li><a href="${href}"${href === page.file ? ' aria-current="page"' : ''}>${label}</a></li>`
  ).join('\n          ');
  const vars = {
    title: page.title,
    description: page.description,
    name: site.name,
    short: site.short,
    email: site.email,
    nav,
    contactCurrent: page.file === 'contact.html' ? ' aria-current="page"' : '',
    content: fs.readFileSync(src, 'utf8').trim(),
  };
  const html = layout.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in vars)) throw new Error('Unknown placeholder {{' + k + '}} in layout');
    return vars[k];
  });
  fs.writeFileSync(path.join(dist, page.file), html);
}
console.log('Built ' + site.pages.length + ' pages into dist/');
