import { useCallback, useEffect, useRef } from 'react';

type WorkerRequest =
  | {
      type: 'encrypt';
      data: { plaintext: string; key: Uint8Array };
    }
  | {
      type: 'decrypt';
      data: { ciphertext: string; key: Uint8Array };
    };

type EncryptResult = {
  type: 'encrypted';
  encrypted: string;
};

type DecryptResult = {
  type: 'decrypted';
  decrypted: string;
};

export function useCryptoWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('/src/shared/crypto/crypto-worker.ts', import.meta.url));

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const encrypt = useCallback(
    (plaintext: string, key: Uint8Array): Promise<string> =>
      new Promise((resolve) => {
        const handleMessage = (e: MessageEvent<EncryptResult>) => {
          if (e.data.type === 'encrypted') {
            resolve(e.data.encrypted);
            workerRef.current?.removeEventListener('message', handleMessage);
          }
        };

        workerRef.current?.addEventListener('message', handleMessage);

        workerRef.current?.postMessage({
          type: 'encrypt',
          data: { plaintext, key },
        } satisfies WorkerRequest);
      }),
    []
  );

  const decrypt = useCallback(
    (ciphertext: string, key: Uint8Array): Promise<string> =>
      new Promise((resolve) => {
        const handleMessage = (e: MessageEvent<DecryptResult>) => {
          if (e.data.type === 'decrypted') {
            resolve(e.data.decrypted);
            workerRef.current?.removeEventListener('message', handleMessage);
          }
        };

        workerRef.current?.addEventListener('message', handleMessage);

        workerRef.current?.postMessage({
          type: 'decrypt',
          data: { ciphertext, key },
        } satisfies WorkerRequest);
      }),
    []
  );

  return { encrypt, decrypt };
}
