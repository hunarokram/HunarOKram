/**
 * Converts text into a URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates text to a specified maximum length.
 */
export function truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength - ellipsis.length)) + ellipsis;
}

/**
 * Strips HTML tags and trims whitespace.
 */
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Capitalizes the first letter of the text.
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalizes the first letter of each word.
 */
export function capitalizeWords(text: string): string {
  return text.split(' ').map(capitalize).join(' ');
}

/**
 * Generates a random alphanumeric booking number.
 */
export function generateBookingNumber(prefix: string = 'BK-'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Masks an email address for privacy.
 */
export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [name, domain] = parts;
  if (!name) return email;
  if (name.length <= 2) return `*@${domain}`;
  return `${name.charAt(0)}***@${domain}`;
}

/**
 * Masks a phone number for privacy.
 */
export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return '*'.repeat(Math.max(0, phone.length - 4)) + phone.slice(-4);
}

/**
 * Type guard for checking if a string is not empty.
 */
export function isNotEmpty(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Pluralizes a word based on a count.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const pluralWord = plural || `${singular}s`;
  return `${count} ${count === 1 ? singular : pluralWord}`;
}
