import React, { useCallback, useEffect, useMemo, useState } from 'react';
import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64 } from 'tweetnacl-util';

const useDH = () => {
  const [keyPair, setKeyPair] = useState<nacl.BoxKeyPair>();
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

  const handleRecieveMessage = useCallback((message: string) => {
    if (!sharedKey) return;
    const decoded = decodeBase64(message);
    const nonce = decoded.slice(0, 24);
    const cipher = decoded.slice(24);
    const plain = nacl.box.open.after(cipher, nonce, sharedKey);
    return plain
  }, [])


  return { generatePublicKey, handleRecievePublicKey, handleRecieveMessage }
}

export default useDH;
