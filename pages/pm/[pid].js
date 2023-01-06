import { useEffect } from 'react';
import Head from 'next/head'
import Chat from '../../components/Chat/Chat'
import { observer, inject } from 'mobx-react';
import { useRouter } from 'next/router'


function PrivateMessage({ store, params }) {
  const router = useRouter()
  const { pid } = router.query
  
  useEffect(() => {
    store.createConnection('pm', {chatId: window.location.pathname.split('/')[2]})
    return () => {
    };
  }, []);
  return (
    <>
      <Head>
        <title>CryptoChat</title>
        <meta name="description" content="Pet-project. Live chat with end-to-end encryption" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <div className="content">
          <div className="content__wrapper">
            <div className="content__chat">
              <Chat pid={pid}/>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default inject('store')(observer(PrivateMessage))
