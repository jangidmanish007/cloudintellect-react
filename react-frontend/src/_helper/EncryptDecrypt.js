// Encrypt/Decrypt utilities using Web Crypto API

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * Generate a crypto key from a passphrase
 */
const getKey = async (passphrase) => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('salt'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt a string value
 * @param {string} value - Plain text to encrypt
 * @param {string} passphrase - Secret passphrase
 * @returns {Promise<string>} - Base64 encoded encrypted string
 */
export const encrypt = async (value, passphrase) => {
  const enc = new TextEncoder();
  const key = await getKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    enc.encode(value)
  );
  const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...combined));
};

/**
 * Decrypt an encrypted string
 * @param {string} encryptedValue - Base64 encoded encrypted string
 * @param {string} passphrase - Secret passphrase
 * @returns {Promise<string>} - Decrypted plain text
 */
export const decrypt = async (encryptedValue, passphrase) => {
  const dec = new TextDecoder();
  const key = await getKey(passphrase);
  const combined = Uint8Array.from(atob(encryptedValue), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
  return dec.decode(decrypted);
};
