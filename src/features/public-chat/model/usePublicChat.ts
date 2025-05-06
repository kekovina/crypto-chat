import { useSocket } from '@/shared/hooks/useSocket';
import {
  CLIENT_TO_SERVER_EVENTS_KEY,
  SERVER_TO_CLIENT_EVENTS_KEY,
  ServerMessage,
} from '@/shared/types/socket';
import { useEffect } from 'react';

type UsePublicChatConfig = {
  onMessageReceived?: (message: ServerMessage) => void;
  onLogin?: (username: string) => void;
};

export function usePublicChat(config: UsePublicChatConfig = {}) {
  const { emit, on, off } = useSocket({ url: '/chat' });

  useEffect(() => {
    const loginHandler = ({ username }: ServerMessage) => {
      config.onLogin?.(username);
    };
    const messageHandler = (message: ServerMessage) => config.onMessageReceived?.(message);

    on(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
    on(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, messageHandler);
    return () => {
      off(SERVER_TO_CLIENT_EVENTS_KEY.LOGIN, loginHandler);
      off(SERVER_TO_CLIENT_EVENTS_KEY.NEW_MESSAGE, messageHandler);
    };
  }, [config, off, on]);

  const onSendMessage = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
    const message = inputElement.value;
    if (message) {
      emit(CLIENT_TO_SERVER_EVENTS_KEY.NEW_MESSAGE, {
        text: message,
      });

      inputElement.value = '';
    }
  };

  return {
    onSendMessage,
    emit,
    on,
    off,
  };
}
