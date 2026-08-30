const fs = require('fs');

const THEME_CONFIG = `const THEME_CONFIG: Record<string, any> = {
  terracotta: {
    '--brand': '#a84b23', '--brand-hover': '#8c3e1d', '--accent': '#c8622e',
    '--bg-main': '#faf9f7', '--bg-alt': '#f8f6f0', '--bg-dark': '#2D332B', '--bg-card': '#ffffff',
    '--border': '#edeae4', '--text-main': '#2c2a27', '--text-muted': '#5a5754', '--text-light': '#8a8782',
    '--grad-1': '#4a3b2c', '--grad-2': '#7a5537', '--grad-3': '#a8744f',
  },
  ocean: {
    '--brand': '#2563eb', '--brand-hover': '#1d4ed8', '--accent': '#3b82f6',
    '--bg-main': '#f8fafc', '--bg-alt': '#f1f5f9', '--bg-dark': '#0f172a', '--bg-card': '#ffffff',
    '--border': '#e2e8f0', '--text-main': '#0f172a', '--text-muted': '#334155', '--text-light': '#64748b',
    '--grad-1': '#0f172a', '--grad-2': '#1e3a8a', '--grad-3': '#3b82f6',
  },
  forest: {
    '--brand': '#16a34a', '--brand-hover': '#15803d', '--accent': '#22c55e',
    '--bg-main': '#f0fdf4', '--bg-alt': '#f0fdfa', '--bg-dark': '#14532d', '--bg-card': '#ffffff',
    '--border': '#dcfce7', '--text-main': '#14532d', '--text-muted': '#166534', '--text-light': '#22c55e',
    '--grad-1': '#14532d', '--grad-2': '#166534', '--grad-3': '#22c55e',
  },
  midnight: {
    '--brand': '#8b5cf6', '--brand-hover': '#7c3aed', '--accent': '#a78bfa',
    '--bg-main': '#020617', '--bg-alt': '#0f172a', '--bg-dark': '#000000', '--bg-card': '#0f172a',
    '--border': '#1e293b', '--text-main': '#f8fafc', '--text-muted': '#cbd5e1', '--text-light': '#94a3b8',
    '--grad-1': '#020617', '--grad-2': '#0f172a', '--grad-3': '#1e1b4b',
  },
  sunset: {
    '--brand': '#f43f5e', '--brand-hover': '#e11d48', '--accent': '#fb7185',
    '--bg-main': '#fff1f2', '--bg-alt': '#ffe4e6', '--bg-dark': '#881337', '--bg-card': '#ffffff',
    '--border': '#fecdd3', '--text-main': '#4c0519', '--text-muted': '#881337', '--text-light': '#be123c',
    '--grad-1': '#881337', '--grad-2': '#be123c', '--grad-3': '#f43f5e',
  },
  lavender: {
    '--brand': '#9333ea', '--brand-hover': '#7e22ce', '--accent': '#a855f7',
    '--bg-main': '#faf5ff', '--bg-alt': '#f3e8ff', '--bg-dark': '#3b0764', '--bg-card': '#ffffff',
    '--border': '#e9d5ff', '--text-main': '#3b0764', '--text-muted': '#581c87', '--text-light': '#7e22ce',
    '--grad-1': '#3b0764', '--grad-2': '#581c87', '--grad-3': '#9333ea',
  },
  monochrome: {
    '--brand': '#171717', '--brand-hover': '#0a0a0a', '--accent': '#404040',
    '--bg-main': '#ffffff', '--bg-alt': '#f5f5f5', '--bg-dark': '#000000', '--bg-card': '#ffffff',
    '--border': '#e5e5e5', '--text-main': '#171717', '--text-muted': '#404040', '--text-light': '#737373',
    '--grad-1': '#000000', '--grad-2': '#171717', '--grad-3': '#404040',
  }
};`;

const path = 'src/app/[organizerSlug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const THEME_CONFIG: Record<string, any> = {[\s\S]*?};/;
content = content.replace(regex, THEME_CONFIG);

fs.writeFileSync(path, content);
console.log('Done rewriting THEME_CONFIG');
