import { MessageType, ServerMessage } from '@/shared/types/socket';

export default function generateSocketMessage(
  username: string,
  type: MessageType,
  text: string,
  payload = {},
  encrypted = false
): ServerMessage {
  return {
    type,
    text,
    username,
    encrypted,
    date: new Date(),
    payload,
  };
}
