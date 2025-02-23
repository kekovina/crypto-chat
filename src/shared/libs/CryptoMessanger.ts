import crypto from 'crypto';
import { promisify } from 'util';

type AliceData = { prime: Buffer; generator: Buffer; key: Buffer };
type BobData = { key: Buffer };
const debug = require('debug')('app:cryptoMessanger');

class CryptoMessanger {
  private readonly keySize = 64;
  private readonly algorithm: string;
  private key: Buffer | null = null;
  private iv: Buffer;
  private Alice: crypto.DiffieHellman | null = null;
  private Bob: crypto.DiffieHellman | null = null;

  constructor(algorithm = 'aes-128-cbc') {
    this.algorithm = algorithm;
    this.iv = this.generateRandomBytes(16);
  }

  async generateAsAlice(): Promise<AliceData> {
    debug('generateAsAlice');
    return new Promise((resolve) => {
      this.Alice = crypto.createDiffieHellman(this.keySize);
      debug('generateAsAlice generated');
      resolve({
        prime: this.Alice.getPrime(),
        generator: this.Alice.getGenerator(),
        key: this.Alice.generateKeys(),
      });
    });
  }

  async generateAsBob(alice: AliceData): Promise<BobData> {
    if (!alice) throw new Error('Alice data is required');
    debug('generateAsBob');
    return new Promise((resolve) => {
      this.Bob = crypto.createDiffieHellman(alice.prime, alice.generator);
      debug('generateAsAlice generated');
      resolve({ key: this.Bob.generateKeys() });
    });
  }

  async setKey(key: Buffer): Promise<void> {
    if (!key) throw new Error('Key is required');
    if (!this.Alice && !this.Bob) throw new Error('You must generate keys first');
    debug('setKey');
    return new Promise((resolve) => {
      debug('%o %o', this.Alice, this.Bob);
      this.key = (this.Alice ?? this.Bob)!.computeSecret(key);
      debug('setKey secret computed');
      this.key = this.key.subarray(0, 16); // AES-128 требует 16-байтовый ключ
      resolve();
    });
  }

  getKey(): Buffer | null {
    return this.key;
  }

  async encrypt(text: string): Promise<string> {
    if (!text || !this.key) return text;
    debug('encrypt');
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const encryptAsync = promisify(cipher.update.bind(cipher));

    const encrypted = (await encryptAsync(text)) as Buffer;
    const final = cipher.final();

    return Buffer.concat([encrypted, final]).toString('base64');
  }

  async decrypt(text: string): Promise<string> {
    if (!text || !this.key) return text;

    debug('decrypt');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const decryptAsync = promisify(decipher.update.bind(decipher));

    const decrypted = (await decryptAsync(text, 'base64', 'utf-8')) as Buffer;
    const final = decipher.final();

    return Buffer.concat([decrypted, final]).toString('utf8');
  }

  /** Генерация случайного 16-байтового буфера */
  private generateRandomBytes(size: number): Buffer {
    return crypto.randomBytes(size);
  }
}

export default CryptoMessanger;
