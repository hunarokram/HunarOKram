/**
 * Parses a value into a Date object safely.
 */
export function parseDateSafely(value: unknown): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * Formats a date to a string.
 */
export function formatDate(date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const d = parseDateSafely(date);
  if (!d) return '';

  const options: Intl.DateTimeFormatOptions = {};
  if (format === 'short') {
    options.month = 'short';
    options.day = 'numeric';
  } else if (format === 'medium') {
    options.month = 'short';
    options.day = 'numeric';
    options.year = 'numeric';
  } else {
    options.weekday = 'long';
    options.month = 'long';
    options.day = 'numeric';
    options.year = 'numeric';
  }

  return new Intl.DateTimeFormat('en-IN', options).format(d);
}

/**
 * Formats time from a date.
 */
export function formatTime(date: Date | string, format: '12h' | '24h' = '12h'): string {
  const d = parseDateSafely(date);
  if (!d) return '';

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: format === '12h',
  }).format(d);
}

/**
 * Formats date and time.
 */
export function formatDateTime(date: Date | string): string {
  const d = parseDateSafely(date);
  if (!d) return '';
  return `${formatDate(d, 'medium')} at ${formatTime(d, '12h')}`;
}

/**
 * Formats a date to a relative string (e.g., '2 hours ago').
 */
export function formatRelative(date: Date | string): string {
  const d = parseDateSafely(date);
  if (!d) return '';

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' });

  if (Math.abs(diffDays) > 0) {
    if (Math.abs(diffDays) > 30) return formatDate(d, 'medium');
    return rtf.format(diffDays, 'day');
  }
  if (Math.abs(diffHours) > 0) return rtf.format(diffHours, 'hour');
  if (Math.abs(diffMinutes) > 0) return rtf.format(diffMinutes, 'minute');
  return rtf.format(diffSeconds, 'second');
}

/**
 * Checks if a date is in the past.
 */
export function isDateInPast(date: Date | string): boolean {
  const d = parseDateSafely(date);
  return d ? d.getTime() < Date.now() : false;
}

/**
 * Checks if a date is in the future.
 */
export function isDateInFuture(date: Date | string): boolean {
  const d = parseDateSafely(date);
  return d ? d.getTime() > Date.now() : false;
}

/**
 * Checks if two dates are on the same calendar day.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Gets the start of the day for a date.
 */
export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Gets the end of the day for a date.
 */
export function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Adds a number of days to a date.
 */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Adds a number of hours to a date.
 */
export function addHours(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
}

/**
 * Gets a duration string from minutes.
 */
export function getDurationString(minutes: number): string {
  if (minutes < 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
