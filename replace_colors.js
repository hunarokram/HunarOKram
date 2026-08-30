const fs = require('fs');

const path = 'src/app/[organizerSlug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace colors
content = content.replace(/bg-\[#a84b23\]/g, 'bg-[var(--brand)]');
content = content.replace(/hover:bg-\[#8c3e1d\]/g, 'hover:bg-[var(--brand-hover)]');
content = content.replace(/text-\[#a84b23\]/g, 'text-[var(--brand)]');
content = content.replace(/fill-\[#a84b23\]/g, 'fill-[var(--brand)]');
content = content.replace(/text-\[#c8622e\]/g, 'text-[var(--accent)]');
content = content.replace(/bg-\[#c8622e\]/g, 'bg-[var(--accent)]');
content = content.replace(/bg-\[#f8f6f0\]/g, 'bg-[var(--bg-alt)]');
content = content.replace(/bg-\[#2D332B\]/g, 'bg-[var(--bg-dark)]');
// Also group-hover for bg
content = content.replace(/group-hover:bg-\[#a84b23\]/g, 'group-hover:bg-[var(--brand)]');
content = content.replace(/group-hover:text-\[#a84b23\]/g, 'group-hover:text-[var(--brand)]');

fs.writeFileSync(path, content);
console.log('Done mapping page.tsx colors');
