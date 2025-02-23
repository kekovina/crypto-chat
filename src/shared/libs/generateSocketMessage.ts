export default function generateSocketMessage(
  username: string,
  type: MessageType,
  text: string,
  payload = {},
  encrypted = false
): Message {
  return {
    type,
    text,
    username,
    encrypted,
    date: new Date(),
    payload,
  };
}
