import { useCryptoWorker } from '@/shared/hooks/useCryptoWorker';
import useDH from '@/shared/hooks/useDH';
import { useSocket } from '@/shared/hooks/useSocket';
import {
  ChatEvents,
  CLIENT_TO_SERVER_EVENTS_KEY,
  SERVER_TO_CLIENT_EVENTS_KEY,
  ServerMessage,
} from '@/shared/types/socket';
import { useEffect, useState } from 'react';
import { getEmoji, sha256 } from '../utils';

type UseSecureChatConfig = {
  onMessageReceived?: (message: ServerMessage) => void;
  onLogin?: (username: string) => void;
};

export function useSecureChat(pid?: string, config: UseSecureChatConfig = {}) {
  const [emoji, setEmoji] = useState<string | null>(null);
  const [isMateConnected, setIsMateConnected] = useState(false);

  const { emit, on, off } = useSocket({ url: '/pm', query: { chatId: pid } });
  const { encrypt, decrypt } = useCryptoWorker();
  const { sharedKey, receiveTheirPublicKey, getMyPublicKeyBase64 } = useDH();

  // Обработка ключей
  useEffect(() => {
    const publicKeyHandler = (msg: ServerMessage) => {
      receiveTheirPublicKey(msg.payload.publicKey as string);
    };

    if (pid) {
      on(SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY, publicKeyHandler);
      return () => off(SERVER_TO_CLIENT_EVENTS_KEY.RECIEVE_PUBLIC_KEY, publicKeyHandler);
    }
  }, [pid]);

  useEffect(() => {
    if (sharedKey) {
      sha256(sharedKey).then(() => {
        setEmoji(getEmoji(sharedKey));
      });
    }
  }, [sharedKey]);

  // Слушатель подключения собеседника
  useEffect(() => {
    const loginHandler = ({ username }: ServerMessage) => {
      config.onLogin?.(username);
    };
    const handleMateEvent = (msg: ServerMessage) => {
      const { mate, event } = msg.payload;
      if (mate) {
        emit(CLIENT_TO_SERVER_EVENTS_KEY.SEND_PUBLIC_KEY, {
          payload: { publicKey: getMyPublicKeyBase64() },
        });
        setIsMateConnected(true);
      }
      if (event === ChatEvents.MATE_LEFT) {
        setIsMateConnected(false);
      }
      config.onMessageReceived?.(msg);
    };
    const encryptedMessageHandler = async (message: ServerMessage) => {
      const decryptedMessage = {
        ...message,
        text: await decrypt(message.text, sharedKey as Uint8Array),
      };
      config.onMessageReceived?.(decryptedMessage);
    };

    if (pid) {
      on(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
      on(SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE, encryptedMessageHandler);
      on(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, handleMateEvent);
      return () => {
        off(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
        off(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, handleMateEvent);
        off(SERVER_TO_CLIENT_EVENTS_KEY.ENCRYPTED_MESSAGE, encryptedMessageHandler);
      };
    }
  }, [pid, sharedKey]);

  const onSendMessage = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
    const message = inputElement.value;
    if (message) {
      emit(CLIENT_TO_SERVER_EVENTS_KEY.ENCRYPTED_MESSAGE, {
        text: await encrypt(message, sharedKey as Uint8Array),
      });

      inputElement.value = '';
    }
  };

  return {
    emoji,
    sharedKey,
    isMateConnected,
    onSendMessage,
    encrypt: (text: string) => encrypt(text, sharedKey!),
    decrypt: (text: string) => decrypt(text, sharedKey!),
    emit,
    on,
    off,
  };
}
