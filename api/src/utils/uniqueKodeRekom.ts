import * as crypto from 'crypto';

export function generateUniqueCode(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase(); // Generates a 12-character alphanumeric string
}
