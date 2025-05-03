import { useCallback, useState } from 'react';
import nacl from 'tweetnacl';
import { decodeBase64, encodeBase64 } from 'tweetnacl-util';

const useDH = () => {
  const [sharedKey, setSharedKey] = useState<Uint8Array | null>(null);

  const [keyPair] = useState<nacl.BoxKeyPair>(() => nacl.box.keyPair());

  const receiveTheirPublicKey = useCallback(
    (publicKeyBase64: string) => {
      if (!keyPair) return;

      const theirKey = decodeBase64(publicKeyBase64);

      const shared = nacl.box.before(theirKey, keyPair.secretKey);
      setSharedKey(shared);
    },
    [keyPair]
  );

  const getMyPublicKeyBase64 = useCallback(() => {
    if (!keyPair) return null;
    return encodeBase64(keyPair.publicKey);
  }, [keyPair]);

  const encryptMessage = useCallback(
    (message: string) => {
      if (!sharedKey) return null;
      const msg = new TextEncoder().encode(message);

      const nonce = nacl.randomBytes(24);
      const encrypted = nacl.box.after(msg, nonce, sharedKey);

      const full = new Uint8Array(nonce.length + encrypted.length);
      full.set(nonce);
      full.set(encrypted, nonce.length);

      return encodeBase64(full);
    },
    [sharedKey]
  );

  const decryptMessage = useCallback(
    (base64: string) => {
      if (!sharedKey) return null;

      const full = decodeBase64(base64);
      const nonce = full.slice(0, 24);
      const box = full.slice(24);

      const decrypted = nacl.box.open.after(box, nonce, sharedKey);
      if (!decrypted) return null;

      return new TextDecoder().decode(decrypted);
    },
    [sharedKey]
  );

  return {
    sharedKey,
    getMyPublicKeyBase64,
    receiveTheirPublicKey,
    encryptMessage,
    decryptMessage,
    isReady: Boolean(sharedKey),
  };
};

export default useDH;
