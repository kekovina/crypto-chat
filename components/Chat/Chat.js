import { observer, inject } from 'mobx-react';
import MessagesArea from './MessagesArea';
import ChatStatus from './ChatStatus';

const LockIcon = ({style}) => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shield-lock-fill" viewBox="0 0 16 16" {...style}>
    <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"/>
  </svg>
}

export default inject('store')(observer(function Chat({ store, pid }){
    
    const onSendMessage = function (e) {
        e.preventDefault()
        const message = e.target[0].value
        if(message){
            store.sendMessage(message)
            e.target[0].value = ''
        }
    }

    const isPrivateMessage = pid ? true : false
    const isMateConnected = store.mate
    const isDisabledMessages = (store.mate !== true && store.mate) || (isPrivateMessage && !isMateConnected)
    return (
        <div className="chat">
            <div className="chat__header chat-header">
                <div className="chat-header__title">{pid ? 'Приватный чат' : 'Общий чат'}</div>
                <div className="chat-header__online">{!pid ? `${store.online} онлайн` : <div style={{ color: 'green'}}><LockIcon style={{ fill: 'green' }}/> защищено</div> }</div>
            </div>
            <div className="chat__messages chat-messages">
                {isPrivateMessage && <ChatStatus isShow={!isMateConnected}/>}
                <div className="chat-messages__container">
                    <MessagesArea/>
                </div>
            </div>
            <div className="chat__input chat-input">
                {isPrivateMessage && isMateConnected && <form onSubmit={onSendMessage}>
                    <input className="chat-input__input" placeholder="Напишите сообщение..."/>
                </form>}
                
                {!isPrivateMessage && <form onSubmit={onSendMessage}>
                    <input className="chat-input__input" placeholder="Напишите сообщение..."/>
                </form>}
                
                {isDisabledMessages && <div className="chat-input__status">Отправка сообщений недоступна</div>}
                
            </div>
        </div>
    )
}))