import fs from 'fs';
import { JSDOM } from 'jsdom';

const DATA_FILE = './assets/data/blogs.json';

const blogs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

blogs.forEach(blog => {
  if (!blog.sections) return;

  blog.sections.forEach(sec => {
    if (!sec.content) return;

    const dom = new JSDOM(`<body>${sec.content}</body>`);
    const document = dom.window.document;

    document.querySelectorAll('table').forEach(table => {

      // ── Fix structure: wrap rows into thead/tbody if missing ──
      if (!table.querySelector('thead')) {
        const rows = [...table.querySelectorAll('tr')];
        const headerRow = rows.find(row => row.querySelector('th'));
        const dataRows  = rows.filter(row => row !== headerRow);

        if (headerRow) {
          const thead = document.createElement('thead');
          thead.appendChild(headerRow.cloneNode(true));
          headerRow.remove();

          const tbody = document.createElement('tbody');
          dataRows.forEach(row => tbody.appendChild(row.cloneNode(true)));
          dataRows.forEach(row => row.remove());

          table.prepend(tbody);
          table.prepend(thead);
        }
      }

      // ── Stamp data-label on every td ──
      const headers = [...table.querySelectorAll('thead th')]
        .map(th => th.textContent.trim());

      if (!headers.length) return;

      table.querySelectorAll('tbody tr').forEach(row => {
        [...row.querySelectorAll('td')].forEach((td, i) => {
          td.setAttribute('data-label', headers[i] || '');
        });
      });
    });

    sec.content = document.body.innerHTML.trim();
  });
});

fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2));
console.log('✅ Tables fixed + data-label injected');