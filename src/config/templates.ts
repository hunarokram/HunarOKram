/**
 * Website template and theme system for organizer public pages.
 */

export interface Typography {
  headingFont: string;
  bodyFont: string;
  headingWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewImagePath: string;
  heroStyle: 'full-bleed' | 'contained' | 'split';
  cardStyle: 'minimal' | 'bordered' | 'elevated' | 'overlay';
  typography: Typography;
  spacing: 'compact' | 'comfortable' | 'spacious';
  cornerRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  isDark: boolean;
}

export const TEMPLATES: Record<string, Template> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, whitespace-heavy, content-focused. Great for studios.',
    previewImagePath: '/templates/preview-minimal.png',
    heroStyle: 'contained',
    cardStyle: 'minimal',
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      headingWeight: 'medium',
    },
    spacing: 'spacious',
    cornerRadius: 'none',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, expressive, asymmetric layouts. Great for artists.',
    previewImagePath: '/templates/preview-creative.png',
    heroStyle: 'split',
    cardStyle: 'overlay',
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Lato, sans-serif',
      headingWeight: 'bold',
    },
    spacing: 'comfortable',
    cornerRadius: 'medium',
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    description: 'Refined, serif typography, premium feel. Great for premium experiences.',
    previewImagePath: '/templates/preview-elegant.png',
    heroStyle: 'full-bleed',
    cardStyle: 'elevated',
    typography: {
      headingFont: 'Merriweather, serif',
      bodyFont: 'Open Sans, sans-serif',
      headingWeight: 'normal',
    },
    spacing: 'spacious',
    cornerRadius: 'small',
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Colorful, energetic, dynamic. Great for kids/fun activities.',
    previewImagePath: '/templates/preview-vibrant.png',
    heroStyle: 'full-bleed',
    cardStyle: 'elevated',
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Quicksand, sans-serif',
      headingWeight: 'extrabold',
    },
    spacing: 'compact',
    cornerRadius: 'full',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, balanced, professional. Great for businesses.',
    previewImagePath: '/templates/preview-classic.png',
    heroStyle: 'contained',
    cardStyle: 'bordered',
    typography: {
      headingFont: 'Roboto, sans-serif',
      bodyFont: 'Roboto, sans-serif',
      headingWeight: 'semibold',
    },
    spacing: 'comfortable',
    cornerRadius: 'medium',
  },
};

export const THEMES: Record<string, Theme> = {
  'warm-clay': {
    id: 'warm-clay',
    name: 'Warm Clay',
    description: 'Warm terracotta/clay tones (great for pottery/craft)',
    colors: {
      primary: '#C16A54',
      secondary: '#E8C5B3',
      accent: '#E07A5F',
      background: '#FDFBF7',
      surface: '#FFFFFF',
      text: '#3D332D',
      textMuted: '#8C7A71',
      border: '#E8E1DC',
      success: '#81B29A',
      warning: '#F2CC8F',
      error: '#E07A5F',
    },
    isDark: false,
  },
  'ocean-breeze': {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blues and teals',
    colors: {
      primary: '#2B6777',
      secondary: '#52AB98',
      accent: '#C8D8E4',
      background: '#F2F2F2',
      surface: '#FFFFFF',
      text: '#1F2A38',
      textMuted: '#6B7C93',
      border: '#E1E5E9',
      success: '#52AB98',
      warning: '#F3B562',
      error: '#F05454',
    },
    isDark: false,
  },
  'forest-green': {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural greens and earth tones',
    colors: {
      primary: '#2D4A22',
      secondary: '#597D35',
      accent: '#8CAE68',
      background: '#F4F7F2',
      surface: '#FFFFFF',
      text: '#1C2916',
      textMuted: '#5D6B57',
      border: '#D8E2D3',
      success: '#597D35',
      warning: '#D4A373',
      error: '#BC4B51',
    },
    isDark: false,
  },
  'sunset-glow': {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm oranges and pinks',
    colors: {
      primary: '#FF6B6B',
      secondary: '#FF8E53',
      accent: '#FFAEBC',
      background: '#FFF5F5',
      surface: '#FFFFFF',
      text: '#2D3748',
      textMuted: '#718096',
      border: '#FED7D7',
      success: '#48BB78',
      warning: '#ECC94B',
      error: '#F56565',
    },
    isDark: false,
  },
  'midnight': {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark mode, deep navy/charcoal with accent pops',
    colors: {
      primary: '#A0AEC0',
      secondary: '#4A5568',
      accent: '#63B3ED',
      background: '#1A202C',
      surface: '#2D3748',
      text: '#F7FAFC',
      textMuted: '#A0AEC0',
      border: '#4A5568',
      success: '#48BB78',
      warning: '#ECC94B',
      error: '#FC8181',
    },
    isDark: true,
  },
  'lavender-dream': {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    description: 'Soft purples and lilacs',
    colors: {
      primary: '#805AD5',
      secondary: '#B794F4',
      accent: '#D6BCFA',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#44337A',
      textMuted: '#805AD5',
      border: '#E9D8FD',
      success: '#68D391',
      warning: '#F6E05E',
      error: '#FC8181',
    },
    isDark: false,
  },
  'coral-reef': {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Coral, pink, and sand tones',
    colors: {
      primary: '#F08080',
      secondary: '#FFA07A',
      accent: '#FFDAB9',
      background: '#FFFaf0',
      surface: '#FFFFFF',
      text: '#5c4033',
      textMuted: '#8b7355',
      border: '#FFE4E1',
      success: '#8FBC8F',
      warning: '#F4A460',
      error: '#CD5C5C',
    },
    isDark: false,
  },
  'monochrome': {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean black and white with one accent color',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#111111',
      textMuted: '#777777',
      border: '#E5E5E5',
      success: '#28A745',
      warning: '#FFC107',
      error: '#DC3545',
    },
    isDark: false,
  },
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Rich golds, amber, and cream',
    colors: {
      primary: '#DAA520',
      secondary: '#B8860B',
      accent: '#FFD700',
      background: '#FFF8DC',
      surface: '#FFFFFF',
      text: '#3E2723',
      textMuted: '#795548',
      border: '#FFECB3',
      success: '#81C784',
      warning: '#FFB300',
      error: '#E57373',
    },
    isDark: false,
  },
  'berry-blend': {
    id: 'berry-blend',
    name: 'Berry Blend',
    description: 'Deep berries, plums, and wines',
    colors: {
      primary: '#880E4F',
      secondary: '#AD1457',
      accent: '#C2185B',
      background: '#FCE4EC',
      surface: '#FFFFFF',
      text: '#311B92',
      textMuted: '#5E35B1',
      border: '#F8BBD0',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
    },
    isDark: false,
  },
};

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES[id];
}

export function getTheme(id: string): Theme | undefined {
  return THEMES[id];
}

export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATES);
}

export function getAllThemes(): Theme[] {
  return Object.values(THEMES);
}

export function getDefaultTemplate(): Template {
  return TEMPLATES['minimal']!;
}

export function getDefaultTheme(): Theme {
  return THEMES['monochrome']!;
}
