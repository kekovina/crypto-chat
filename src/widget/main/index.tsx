import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import Chat from '../components/Chat/Chat';

function Home({ store }) {
  useEffect(() => {
    store.createConnection('chat');
    return () => {};
  }, []);
  return (
    <>
      <Head>
        <title>CryptoChat</title>
        <meta name='description' content='Pet-project. Live chat with end-to-end encryption' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='main'>
        <div className='content'>
          <div className='content__wrapper'>
            <div className='d-flex flex-column justify-content-center my-3 my-lg-0 content__description description'>
              <h1 className='description__title'>CryptoChat</h1>
              <p className='description__text'>Чатик со сквозным шифрованием</p>
              <Link href='/api/createRoom' className='btn btn--gray btn--center'>
                Создать диалог
              </Link>
            </div>
            <div className='content__chat'>
              <Chat />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default inject('store')(observer(Home));
