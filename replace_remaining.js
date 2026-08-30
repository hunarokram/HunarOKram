const fs = require('fs');

const path = 'src/app/[organizerSlug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace image placeholder
content = content.replace(/bg-\[#e9e5df\]/g, 'bg-[var(--border)]');
content = content.replace(/from-\[#d4c9bc\]/g, 'from-[var(--border)]');
content = content.replace(/to-\[#b8a99a\]/g, 'to-[var(--bg-alt)]');

// Replace book now button
content = content.replace(/bg-\[#30332E\]/g, 'bg-[var(--bg-dark)]');

// Replace deco blobs
content = content.replace(/bg-\[#e8e4d9\]/g, 'bg-[var(--border)]');

// Replace footer stats colors
content = content.replace(/text-\[#e0c29f\]/g, 'text-white/70');
content = content.replace(/text-\[#f5d9b3\]/g, 'text-white/90');

fs.writeFileSync(path, content);
console.log('Done mapping remaining colors');
