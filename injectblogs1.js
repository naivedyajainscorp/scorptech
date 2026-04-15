import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const BLOG_DIR = './blog/';
const DATA_FILE = './assets/data/blogs.json';
const INLINE_TAGS = ['i', 'span', 'a', 'em', 'strong', 'b', 'u', 'small', 'label'];

if (!fs.existsSync(DATA_FILE)) {
  console.log('❌ blogs.json not found');
  process.exit(1);
}

const blogs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

blogs.forEach(blog => {

  const filePath = path.join(BLOG_DIR, blog.file);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${blog.file}`);
    return;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // ─────────────────────────────
  // 🔹 HERO
  // ─────────────────────────────

  const titleEl = document.querySelector('.s-blog-article-h1');
  if (titleEl) titleEl.textContent = blog.title;

  const heroImg = document.querySelector('.s-blog-hero-ph img');
  if (heroImg && blog.image) {
    heroImg.setAttribute('src', blog.image);
    heroImg.setAttribute('alt', blog.title || '');
  }

  const metaRow = document.querySelector('.s-blog-meta-row');
  if (metaRow) {
    metaRow.innerHTML = `
      <span>${blog.date || ''}</span>
      <span class="s-blog-meta-sep">·</span>
      <span class="s-blog-read-badge">⏱&nbsp;${blog.readMin || ''} min read</span>
      <span class="s-blog-meta-sep">·</span>
      <span>SCORP Editorial</span>
    `;
  }

  // ─────────────────────────────
  // 🔹 INTRO
  // ─────────────────────────────

  const introWrap = document.querySelector('.s-blog-article-intro');
  if (introWrap && blog.intro) {
    introWrap.innerHTML = blog.intro.trim();
  }

  // ─────────────────────────────
  // 🔹 SECTIONS (CORE)
  // ─────────────────────────────

  const sectionsWrap = document.querySelector('.s-blog-sections-wrap');

  if (!sectionsWrap) {
    console.log(`⚠️ Sections wrapper missing in ${blog.file}`);
    return;
  }

  // Preserve intro + divider as HTML strings before clearing
  const introHTML   = sectionsWrap.querySelector('.s-blog-article-intro')?.outerHTML || '';
  const dividerHTML = sectionsWrap.querySelector('.s-blog-intro-divider')?.outerHTML || '';

  sectionsWrap.innerHTML = introHTML + dividerHTML;

  // Duplicate ID guard
  const usedIds = new Set();

  // Collect resolved IDs so TOC stays in sync
  const resolvedIds = blog.sections.map((sec, index) => {
    const baseId = sec.id || `${index + 1}`;
    let secId = `sec-${baseId}`;
    let counter = 1;
    while (usedIds.has(secId)) {
      secId = `sec-${baseId}-${counter++}`;
    }
    usedIds.add(secId);
    return secId;
  });

  blog.sections.forEach((sec, index) => {

    const secId = resolvedIds[index];

const sectionHTML = `
  <div class="s-blog-section" id="${secId}">
    <h2 class="s-text-primary">${sec.title}</h2>
    <div class="s-blog-body-text">
      ${sec.content}
    </div>
  </div>
`;
    sectionsWrap.insertAdjacentHTML('beforeend', sectionHTML);
  });

  // ─────────────────────────────
  // 🔹 TOC BUILDER
  // ─────────────────────────────

  const buildTOCItem = (sec, i) => `
    <li ${i === 0 ? 'class="is-active"' : ''}>
      <a href="#${resolvedIds[i]}" class="s-drawer-link">
        ${sec.tocLabel || sec.title}
      </a>
    </li>
  `;

  const tocDesktop = document.querySelector('#sBlogTocDesktop');
  const tocMobile  = document.querySelector('#sBlogTocMobile');

  const tocHTML = blog.sections.map((sec, i) => buildTOCItem(sec, i)).join('');

  if (tocDesktop) tocDesktop.innerHTML = tocHTML;
  if (tocMobile)  tocMobile.innerHTML  = tocHTML;

  // ─────────────────────────────
  // 🔹 META TAGS
  // ─────────────────────────────

  if (blog.meta?.title) {
    const titleTag = document.querySelector('title');
    if (titleTag) titleTag.textContent = blog.meta.title;
  }

  if (blog.meta?.description) {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', blog.meta.description);
  }

  // ─────────────────────────────
  // 🔹 SAVE
  // ─────────────────────────────

  let serialized = dom.serialize();

  INLINE_TAGS.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*)\/>`, 'g');
    serialized = serialized.replace(regex, `<${tag}$1></${tag}>`);
  });

  fs.writeFileSync(filePath, serialized);
  console.log(`✅ Injected: ${blog.file}`);

});

console.log('🚀 All blogs processed');