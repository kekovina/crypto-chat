import React, { useCallback, useEffect, useMemo, useState } from 'react';
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

const useDH = () => {
  const [_keyPair, setKeyPair] = useState<nacl.BoxKeyPair>();
  const [sharedKey, setSharedKey] = useState<Uint8Array>();

  const generatePublicKey = useMemo(() => {
    const kp = nacl.box.keyPair();
    setKeyPair(kp);
    const base64 = encodeBase64(kp.publicKey);
    return base64
  }, [])

  const handleRecievePublicKey = useCallback((publicKey: string) => {
    const kp = nacl.box.keyPair();
    const theirKey = decodeBase64(publicKey);
    const shared = nacl.box.before(theirKey, kp.secretKey);
    setSharedKey(shared);
    return shared
  }, [])

  const decryptMessage = useCallback((message: string) => {
    if (!sharedKey) return;
    const decoded = decodeBase64(message);
    const nonce = decoded.slice(0, 24);
    const cipher = decoded.slice(24);
    const plain = nacl.box.open.after(cipher, nonce, sharedKey);
    return plain
  }, [])

  const encryptMessage = () => {
    if (!sharedKey) return;
    const msg = new TextEncoder().encode("Hello secret world!");
    const nonce = nacl.randomBytes(24);
    const box = nacl.box.after(msg, nonce, sharedKey);
    const full = new Uint8Array(nonce.length + box.length);
    full.set(nonce);
    full.set(box, nonce.length);
    return encodeBase64(full)
  };


  return { generatePublicKey, handleRecievePublicKey, decryptMessage, encryptMessage }
}

export default useDH;
