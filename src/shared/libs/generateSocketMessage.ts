import { MessageType, ServerMessage } from '@/shared/types/socket';
import { ulid } from 'ulid';

export default function generateSocketMessage(
  username: string,
  type: MessageType,
  text: string,
  payload: Record<string, any> = {}
): ServerMessage {
  return {
    id: ulid(),
    type,
    text,
    username,
    date: new Date(),
    payload,
  };
}
