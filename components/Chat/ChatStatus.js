import ClockLoader from "react-spinners/ClockLoader";
import { useSpring, animated } from '@react-spring/web'

export default function ChatStatus({isShow}){
    const [props, api] = useSpring(
        () => {
          if(isShow){
                return {from: { y: -100}, to: { y: 0}}
            } else {
                return {from: { y: 0}, to: { y: -100}}
          }
    },
        [isShow]
      )
    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href)
    }
    return (
        <animated.div className="chat-messages__status messages-status" style={props}>
            <div className="messages-status__wrapper">
                <div>
                    Пригласите человека с помощью ссылки
                    <button className="btn btn--gray btn--sm mx-1" onClick={copyLink}>Скопировать</button>
                </div>
                <div className="messages-status__status">
                    <ClockLoader size={18} color={"#fff"} cssOverride={{marginRight: 5}}/>
                    <div>Ожидаем собеседника...</div>
                </div>
            </div>
        </animated.div>
    )
}