// Imports an article from a URL into evals/cases/<slug>/: article.md plus its images.
// Usage: node lib/import.js <url> [--issue ENG-123] [--slug name]
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');
const TurndownService = require('turndown');

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const issue = flag('issue');
const slugArg = flag('slug');
const url = args[0];
if (!url) {
  console.error('usage: node lib/import.js <url> [--issue ENG-123] [--slug name]');
  process.exit(1);
}

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

async function main() {
  const res = await fetch(url, { headers: { 'user-agent': userAgent } });
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${res.statusText}`);
  const dom = new JSDOM(await res.text(), { url: res.url });
  const article = new Readability(dom.window.document).parse();
  if (!article || article.textContent.trim().length < 500) {
    throw new Error('no article body found; the page may need JavaScript rendering or be paywalled');
  }

  const slug = slugArg || slugify(article.title || new URL(res.url).pathname);
  const dir = path.join(__dirname, '..', 'cases', slug);
  if (fs.existsSync(dir)) throw new Error(`${path.relative(process.cwd(), dir)} already exists`);
  fs.mkdirSync(path.join(dir, 'images'), { recursive: true });

  // Download each image and point its src at the local copy.
  const body = new JSDOM(article.content, { url: res.url }).window.document;
  let n = 0;
  for (const img of body.querySelectorAll('img')) {
    const src = img.src;
    if (!src || src.startsWith('data:')) {
      img.remove();
      continue;
    }
    try {
      const r = await fetch(src, { headers: { 'user-agent': userAgent } });
      if (!r.ok) throw new Error(r.status);
      const ext = (r.headers.get('content-type') || '').match(/image\/(png|jpe?g|gif|webp|svg)/)?.[1] || 'png';
      const file = `${String(++n).padStart(2, '0')}.${ext.replace('jpeg', 'jpg')}`;
      fs.writeFileSync(path.join(dir, 'images', file), Buffer.from(await r.arrayBuffer()));
      img.setAttribute('src', `images/${file}`);
    } catch (e) {
      console.warn(`image skipped (${e.message}): ${src}`);
    }
  }
  if (n === 0) fs.rmdirSync(path.join(dir, 'images'));

  const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  const markdown = turndown.turndown(body.body.innerHTML);
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(article.title || '')}`,
    `source: ${res.url}`,
    article.byline ? `author: ${JSON.stringify(article.byline)}` : null,
    issue ? `issue: ${issue}` : null,
    `fetched: ${new Date().toISOString().slice(0, 10)}`,
    '---',
  ]
    .filter(Boolean)
    .join('\n');
  fs.writeFileSync(path.join(dir, 'article.md'), `${frontmatter}\n\n# ${article.title}\n\n${markdown}\n`);
  console.log(`${path.relative(process.cwd(), dir)}: ${markdown.split(/\s+/).length} words, ${n} images`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
