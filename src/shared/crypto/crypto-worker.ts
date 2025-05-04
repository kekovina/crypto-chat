import decrypt, { encrypt } from '@/shared/libs/crypto';

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'encrypt') {
    const encrypted = await encrypt(data.plaintext, data.key);
    self.postMessage({ type: 'encrypted', encrypted });
  }

  if (type === 'decrypt') {
    const decrypted = await decrypt(data.ciphertext, data.key);
    self.postMessage({ type: 'decrypted', decrypted });
  }
};

export {};
