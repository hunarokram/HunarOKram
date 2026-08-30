/**
 * Safely validates if a string is a valid URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a redirect URL to prevent open redirect vulnerabilities.
 */
export function isSafeRedirectUrl(url: string, allowedDomains: string[] = []): boolean {
  if (!url) return false;
  if (url.startsWith('/') && !url.startsWith('//')) return true;

  try {
    const parsedUrl = new URL(url);
    return allowedDomains.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
}

/**
 * Builds the public page URL for an organizer or experience.
 */
export function buildPublicUrl(organizerSlug: string, experienceSlug?: string): string {
  const base = `/${organizerSlug}`;
  if (experienceSlug) {
    return `${base}/e/${experienceSlug}`;
  }
  return base;
}

/**
 * Builds an optimized Cloudinary URL with transformations.
 */
export function buildCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif';
    crop?: 'fill' | 'fit' | 'thumb';
  }
): string {
  if (!publicId) return '';

  const transforms: string[] = [];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  
  const quality = options?.quality || 'auto';
  transforms.push(`q_${quality}`);
  
  const format = options?.format || 'auto';
  transforms.push(`f_${format}`);

  const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';
  
  return `https://res.cloudinary.com/demo/image/upload/${transformString}${publicId}`;
}
