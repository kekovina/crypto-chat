import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export function getHashedSharedKey(sharedKey: Uint8Array) {
  return createHash('sha256').update(sharedKey).digest();
}

export function fromBase64(base64: string): Uint8Array {
  return new Uint8Array([...atob(base64)].map((char) => char.charCodeAt(0)));
}

export function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

export async function encrypt(plaintext: string, sharedKey: Uint8Array): Promise<string> {
  const key = getHashedSharedKey(sharedKey);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const result = Buffer.concat([iv, encrypted, tag]);

  return toBase64(result);
}

export default async function decrypt(
  encryptedMessage: string,
  sharedKey: Uint8Array
): Promise<string> {
  const key = getHashedSharedKey(sharedKey);
  const buffer = fromBase64(encryptedMessage);
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(-16);
  const ciphertext = buffer.subarray(12, -16);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}
