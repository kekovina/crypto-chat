import emojiList from '@/shared/config/emoji';

export const sha256 = async (data: Uint8Array): Promise<Uint8Array> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
};

export const getEmoji = (sharedKeySHA: Uint8Array) => {
  const bytes = sharedKeySHA.slice(0, 6);
  return bytes.reduce((acc, byte) => acc + emojiList[byte % emojiList.length], '');
};
