/**
 * SAHYOG Cryptographic Utilities for Secure Authentication
 * NEVER store plaintext passwords.
 * Implements salted SHA-256 hashing via Web Crypto API.
 */

export async function hashPasswordWithSalt(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const activeSalt = salt || generateSalt();
  const data = new TextEncoder().encode(activeSalt + ':' + password);

  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return { hash: hashHex, salt: activeSalt };
  }

  // Pure fallback for environments where crypto.subtle is unavailable
  let hash = 0;
  const str = activeSalt + ':' + password;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return { hash: Math.abs(hash).toString(16).padStart(64, '0'), salt: activeSalt };
}

export async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const { hash } = await hashPasswordWithSalt(password, salt);
  return hash === storedHash;
}

export function generateSalt(length: number = 16): string {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    globalThis.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateToken(prefix: string = 'sahyog'): string {
  const randomPart = generateSalt(24);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${randomPart}`;
}
