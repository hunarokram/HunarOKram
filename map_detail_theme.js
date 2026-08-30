const fs = require('fs');

const path = 'src/app/[organizerSlug]/[experienceId]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Imports
content = content.replace(
  "import BookingForm from '@/components/storefront/BookingForm';",
  "import BookingForm from '@/components/storefront/BookingForm';\nimport { THEME_CONFIG } from '@/lib/theme';"
);

// Theme vars extraction
content = content.replace(
  "const mainImage = images[0] || null;",
  "const mainImage = images[0] || null;\n  const themeVars = THEME_CONFIG[(organizer as any).theme || 'terracotta'] || THEME_CONFIG.terracotta;"
);

// Wrap main
content = content.replace(
  /<main className="w-full min-h-screen bg-\[#faf9f7\] font-sans pb-24">/,
  '<main className="w-full min-h-screen bg-[var(--bg-main)] font-sans pb-24" style={themeVars as React.CSSProperties}>'
);

// Colors mapping:
content = content.replace(/bg-\[#a84b23\]/g, 'bg-[var(--brand)]');
content = content.replace(/hover:bg-\[#8c3e1d\]/g, 'hover:bg-[var(--brand-hover)]');
content = content.replace(/text-\[#a84b23\]/g, 'text-[var(--brand)]');
content = content.replace(/fill-\[#a84b23\]/g, 'fill-[var(--brand)]');
content = content.replace(/text-\[#c8622e\]/g, 'text-[var(--accent)]');
content = content.replace(/bg-\[#c8622e\]/g, 'bg-[var(--accent)]');
content = content.replace(/bg-\[#f8f6f0\]/g, 'bg-[var(--bg-alt)]');
content = content.replace(/bg-\[#2D332B\]/g, 'bg-[var(--bg-dark)]');
content = content.replace(/group-hover:bg-\[#a84b23\]/g, 'group-hover:bg-[var(--brand)]');
content = content.replace(/group-hover:text-\[#a84b23\]/g, 'group-hover:text-[var(--brand)]');

content = content.replace(/bg-white/g, 'bg-[var(--bg-card)]');
content = content.replace(/border-\[#edeae4\]/g, 'border-[var(--border)]');
content = content.replace(/text-\[#2c2a27\]/g, 'text-[var(--text-main)]');
content = content.replace(/text-\[#5a5754\]/g, 'text-[var(--text-muted)]');
content = content.replace(/text-\[#8a8782\]/g, 'text-[var(--text-light)]');

content = content.replace(/bg-\[#e9e5df\]/g, 'bg-[var(--border)]');
content = content.replace(/from-\[#d4c9bc\]/g, 'from-[var(--border)]');
content = content.replace(/to-\[#b8a99a\]/g, 'to-[var(--bg-alt)]');

content = content.replace(/bg-\[#30332E\]/g, 'bg-[var(--bg-dark)]');
content = content.replace(/bg-\[#e8e4d9\]/g, 'bg-[var(--border)]');

// Fix arbitrary opacities
content = content.replace(/bg-\[var\(--brand\)\]\/90/g, 'bg-[var(--brand)]');
content = content.replace(/bg-\[var\(--bg-card\)\]\/95/g, 'bg-[var(--bg-card)]');
content = content.replace(/bg-\[var\(--bg-card\)\]\/80/g, 'bg-[var(--bg-card)]');
content = content.replace(/bg-\[var\(--bg-card\)\]\/50/g, 'bg-[var(--bg-card)]');

// Also BookingForm is a component that might have hardcoded colors
fs.writeFileSync(path, content);
console.log('Done mapping detail page');
