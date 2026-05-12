import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const audioDir = path.join(root, 'audio');
const templatePath = path.join(root, 'audio-page.template.html');

function titleFromSlug(slug) {
  return slug
    .split(/[_-]+/g)
    .filter(Boolean)
    .map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function main() {
  const template = fs.readFileSync(templatePath, 'utf8');
  const entries = fs.readdirSync(audioDir).filter(function (f) {
    return f.toLowerCase().endsWith('.ogg');
  });

  const slugs = entries
    .map(function (file) {
      return path.basename(file, path.extname(file));
    })
    .sort(function (a, b) {
      return a.localeCompare(b);
    });

  for (const slug of slugs) {
    const title = titleFromSlug(slug);
    const html = template.replaceAll('{{SLUG}}', slug).replaceAll('{{TITLE}}', title);
    const outName = slug + '.html';
    fs.writeFileSync(path.join(root, outName), html, 'utf8');
    console.log('wrote', outName);
  }

  const indexPath = path.join(root, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  const hubMarker = /\n\s*<!-- audio-pages:begin -->[\s\S]*?<!-- audio-pages:end -->/;
  const listItems = slugs
    .map(function (slug) {
      const title = titleFromSlug(slug);
      return (
        '            <li><a href="' +
        escapeAttr(slug + '.html') +
        '">' +
        escapeAttr(title) +
        '</a></li>'
      );
    })
    .join('\n');

  const hubBlock =
    '\n\n    <!-- audio-pages:begin -->\n' +
    '    <nav class="audio-hub" aria-label="Messages from each child">\n' +
    '        <p class="audio-hub__title">Hear a message</p>\n' +
    '        <ul class="audio-hub__list">\n' +
    listItems +
    '\n        </ul>\n' +
    '    </nav>\n' +
    '    <!-- audio-pages:end -->';

  if (!hubMarker.test(indexHtml)) {
    console.warn('index.html: missing audio-pages markers; skipping hub update');
  } else {
    indexHtml = indexHtml.replace(hubMarker, hubBlock);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log('updated index.html hub links');
  }
}

main();
