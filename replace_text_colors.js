const fs = require('fs');

function addVars(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/bg-white/g, 'bg-[var(--bg-card)]');
  content = content.replace(/border-\[#edeae4\]/g, 'border-[var(--border)]');
  content = content.replace(/text-\[#2c2a27\]/g, 'text-[var(--text-main)]');
  content = content.replace(/text-\[#5a5754\]/g, 'text-[var(--text-muted)]');
  content = content.replace(/text-\[#8a8782\]/g, 'text-[var(--text-light)]');
  fs.writeFileSync(filePath, content);
}

addVars('src/app/[organizerSlug]/page.tsx');
addVars('src/components/ui/testimonial-carousel.tsx');
console.log('Done mapping text and card colors');
