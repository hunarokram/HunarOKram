const fs = require('fs');

const path = 'src/components/ui/testimonial-carousel.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/bg-\[#a84b23\]/g, 'bg-[var(--brand)]');
content = content.replace(/hover:bg-\[#a84b23\]/g, 'hover:bg-[var(--brand)]');
content = content.replace(/hover:text-\[#a84b23\]/g, 'hover:text-[var(--brand)]');
content = content.replace(/text-\[#a84b23\]/g, 'text-[var(--brand)]');
content = content.replace(/fill-\[#a84b23\]/g, 'fill-[var(--brand)]');
content = content.replace(/text-\[#c8622e\]/g, 'text-[var(--accent)]');
content = content.replace(/bg-\[#c8622e\]/g, 'bg-[var(--accent)]');
content = content.replace(/hover:bg-\[#c8622e\]/g, 'hover:bg-[var(--accent)]');

fs.writeFileSync(path, content);
console.log('Done mapping testimonial-carousel.tsx colors');
