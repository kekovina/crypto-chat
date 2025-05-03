import { Message, MessageType } from "../types/socket";

export default function generateSocketMessage(
  username: string,
  type: MessageType,
  text: string,
  payload: Record<string, any> = {},
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
