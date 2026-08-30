const fs = require('fs');

const path = 'src/components/storefront/BookingForm.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/#2c2a27/g, 'var(--text-main)');
content = content.replace(/#edeae4/g, 'var(--border)');
content = content.replace(/#8a8782/g, 'var(--text-light)');
content = content.replace(/#f5f2ee/g, 'var(--bg-alt)');
content = content.replace(/#c8622e/g, 'var(--accent)');
content = content.replace(/#fdf9f6/g, 'var(--bg-main)');
content = content.replace(/#c8c4be/g, 'var(--border)');
content = content.replace(/#faf9f7/g, 'var(--bg-main)');
content = content.replace(/#b0aca6/g, 'var(--text-light)');
content = content.replace(/#1a1815/g, 'var(--bg-dark)');

// Fix opacity wrappers in Tailwind arbitrary properties that will fail:
// e.g., hover:border-[#c8622e]/40 -> hover:border-[var(--accent)]/40 (will fail)
content = content.replace(/hover:border-\[var\(--accent\)\]\/40/g, 'hover:border-[var(--accent)]');

// focus:ring-[var(--text-main)]/10 -> focus:ring-[var(--text-main)]
content = content.replace(/focus:ring-\[var\(--text-main\)\]\/10/g, 'focus:ring-[var(--text-main)] focus:ring-opacity-10');

// Replace inline style correctly (it's using `#2c2a27` which was replaced to `var(--text-main)` but needs to be in string quotes for CSS, which is fine since it's an inline style string now)
// Wait, React inline style `color: 'var(--text-main)'` works perfectly!

// Wait, the replacements were done on the raw hex codes. 
// If there was a `text-[#2c2a27]`, it became `text-[var(--text-main)]`, which is correct!
// If there was `border-[#edeae4]`, it became `border-[var(--border)]`, which is correct!
// If there was `border-[#c8622e]/40`, it became `border-[var(--accent)]/40`, which I need to fix.

fs.writeFileSync(path, content);
console.log('Done mapping booking form');
