/**
 * Application-wide constants
 */

export const APP_NAME = 'AnotherIdea';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const SESSION = {
  MAX_AGE_DAYS: 7,
  COOKIE_NAME: 'session_token',
} as const;

export const SLUG = {
  RESERVED_SLUGS: [
    'admin', 'api', 'auth', 'dashboard', 'settings', 'pricing',
    'about', 'help', 'support', 'terms', 'privacy', 'blog',
    'discover', 'search', 'explore'
  ],
} as const;

export const FILE_UPLOAD = {
  MAX_IMAGE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  MAX_IMAGES_PER_EXPERIENCE: 10,
} as const;

export const BOOKING = {
  MIN_SEATS: 1,
  MAX_SEATS: 20,
  BOOKING_NUMBER_PREFIX: 'BK',
} as const;

export const RATE_LIMIT = {
  DEFAULT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  DEFAULT_MAX_REQUESTS: 100,
} as const;

export const EXPERIENCE = {
  MAX_FAQS: 15,
  MAX_TAGS: 10,
  MAX_WHAT_YOULL_DO: 20,
  MAX_WHATS_INCLUDED: 20,
  MAX_REQUIREMENTS: 10,
  MAX_CUSTOM_FIELDS: 10,
} as const;
