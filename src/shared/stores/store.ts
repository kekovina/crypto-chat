import io from "socket.io-client";
import {action, reaction, makeAutoObservable} from "mobx";
import CryptoMessanger from "../utils/CryptoMessanger";

class MainStore {

    constructor(){
        makeAutoObservable(this)
    }

    socket = null;
    login = null;
    role = null;
    mate = null;
    cryptoMessanger = null;

    messages = []
    online = 0

    addMessage = action((message) => {
        this.messages.push(message)
    })

    setOnline = action((online) => {
        this.online = online
    })

    setLogin = action((login) => {
        this.login = login
    })

    setMate = action((mate) => {
        this.mate = mate
    })

    setRole = action((role) => {
        this.role = role
    })

    setCryptoMessanger = action((cryptoMessanger) => {
        this.cryptoMessanger = cryptoMessanger
    })

    createConnection = function (namespace, data = {}) {
        if(!this.socket){
            fetch('/api/socket').finally(() => {
                const socket = io(`/${namespace}`,
                    { query: {chatId: data.chatId},
                        transport: 'pooling'
                    })
                this.socket = socket
                socket.on('connect', () => {
                    console.log('connect')
                })
                socket.on('disconnect', () => {})

                socket.on('main:login', (data) => {
                    this.setLogin(data.login)
                })
                socket.on('pm:login', (data) => {
                    this.setLogin(data.login)
                })

                socket.on('pm:alice_send_key', (data) => {
                    if(this.role == 'bob'){
                        if(!this.cryptoMessanger){
                            store.setCryptoMessanger(new CryptoMessanger())
                        }
                        const bobData = store.cryptoMessanger.generateAsBob(data)
                        store.socket.emit('pm:bob_send_key', bobData)
                    }
                    if(!this.cryptoMessanger.getKey()){
                        this.cryptoMessanger.setKey(data.key)
                    }
                })

                socket.on('pm:bob_send_key', (data) => {
                    if(!this.cryptoMessanger.getKey()){
                        this.cryptoMessanger.setKey(data.key)
                    }
                })
               
            })
        }
    }

    sendMessage = function (message) {
        if(this.cryptoMessanger){
            message = this.cryptoMessanger.encrypt(message)
            this.socket.emit('pm:new_message', { text: message})
        } else {
            this.socket.emit('main:new_message', { text: message})
        }
    }
}

const store = new MainStore();

// появился собеседник
reaction(
    () => store.mate == true, 
    () => {
        if(store.role == 'alice'){
            if(!store.cryptoMessanger){
                store.setCryptoMessanger(new CryptoMessanger())
            }
            if(!store.cryptoMessanger.getKey()){
                const aliceData = store.cryptoMessanger.generateAsAlice()
                store.socket.emit('pm:alice_send_key', aliceData)
            }
            
        }
    }
)




export default store;