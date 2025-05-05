'use client';

import { PublicChat } from '@/features/public-chat';
import { SecureChat } from '@/features/secure-chat';

export default function Chat({ pid }: { pid?: string }) {
  const isPrivateMessage = !!pid;

  if (isPrivateMessage) {
    return <SecureChat pid={pid} />;
  }

  return <PublicChat />;
}
