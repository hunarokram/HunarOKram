/**
 * Generates a universally unique identifier (UUID).
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generates a cryptographically secure random hex token.
 */
export function generateToken(bytes: number = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Checks if a string matches the MongoDB ObjectId format.
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
