import '@/shared/styles/scss/main.scss';
import Chat from '@/shared/ui/Chat';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='content'>
      <div className='content__wrapper'>
        <div className='d-flex flex-column justify-content-center my-3 my-lg-0 content__description description'>
          <h1 className='description__title'>CryptoChat</h1>
          <p className='description__text'>Чатик со сквозным шифрованием</p>
          <Link href='/api/create-room' className='btn btn--gray btn--center'>
            Создать диалог
          </Link>
        </div>
        <div className='content__chat'>
          <Chat />
        </div>
      </div>
    </div>
  );
}
