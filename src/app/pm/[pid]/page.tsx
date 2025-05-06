'use client';
import Chat from '@/widget/Chat';
import { useParams } from 'next/navigation';

function PrivateMessage() {
  const { pid } = useParams() as { pid: string };

  return (
    <>
      <main className='main'>
        <div className='content'>
          <div className='content__wrapper'>
            <div className='content__chat'>
              <Chat pid={pid} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default PrivateMessage;
