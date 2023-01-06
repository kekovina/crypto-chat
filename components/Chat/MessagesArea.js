import { observer, inject } from 'mobx-react';
import moment from 'moment';
import classnames from 'classnames';
export default inject('store')(observer(function MessagesArea({ store }){

    return store.messages.map(function(message, index, messages){
        if(message.type === 'notification'){
            return (
                <div className="message message--notification" key={new Date(message?.date).getTime() + Math.round(Math.random() * 50)}>
                    <div className="message__text">{message.text}</div>
                </div>
            )
        } else if(message.type === 'message') {
            const authorClasses = classnames({
                'message__author': true,
                'message__author--me': message.ctx == store.login
            })
            const showHeader = message.ctx != messages[index - 1]?.ctx || 
            messages[index - 1]?.type == 'notification' ||
            moment(message.date).diff(moment(messages[index - 1]?.date), 'seconds') > 60
            return (
                <div className="message message--message" key={new Date(message?.date).getTime() + Math.round(Math.random() * 1250)}>
                    {showHeader ? <div className="message__header">
                        <div className={authorClasses}>{message.ctx}</div>
                        <div className="message__time">{moment(message.date).format('HH:mm')}</div>
                    </div> : null}
                    <div className="message__text">{message.text}</div>
                </div>
            )
        }
        
    })
}))