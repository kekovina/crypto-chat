import { observer, Provider } from 'mobx-react'
import store from "../stores/MainStore";
import '../styles/scss/main.scss'

export default function App({ Component, pageProps }) {
  return <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
}
