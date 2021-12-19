
import React, { useState, useRef } from 'react'
import './App.css';

function App() {
  // создаем состояние в которм будем хранить сообщения
  const [messages, setMessages] = useState([])
  // state для сообщения
  const [input, setInput] = useState('')
  // state для input userName
  const [userName, setUserName] = useState('')

  // создаем ref ссылку в которой будем хранить экземпляр webSocket
  const socket = useRef()
  // создадим состояние, которое юудет отображать подключены мы к серверу
  const [connected, setConnected] = useState(false)

  // функция отправки сообщения
  const sendMessage = async () => {
    // Собираем объект сообщения
    const message = {
      event: 'message',
      userName,
      id: Date.now(),
      message: input
    }
    // отправляем сообщение
    socket.current.send(JSON.stringify(message))
    // очищаем input
    setInput('')
  }

  function connect (){
    // В ref ссылку помещаем объект с помощью которого будем работать с Websocket
    // в качестве аргумента передаем сыдрес до websocket-a 
    // здесь обращаем внимание на то, что мы используем не http протокол а ws
    socket.current = new WebSocket('ws://localhost:5000') 
    // теперь на этот websocket мы можем повесить слушатели событий
    // подключения, получения сообщения, закрытия подключения и
    // возникновения ошибки

    // событие onopen сработает в момент подключения
    socket.current.onopen = () => {
      // после того как подключение установлено мы меняем state
      setConnected(true)
      // в момент подключения будем отправлять сообщение
      const message = {
        event: 'connection',
        userName,
        id: Date.now(),
      }
      // отправляем сообщение на сервер
      socket.current.send(JSON.stringify(message))
    }
    // следующее событие onmessage сработает при получении сообщения
    socket.current.onmessage = (event) => {
      // получаем сообщение
      const message = JSON.parse(event.data)
      // это сообщение отправляем в state
      setMessages(prev => [message, ...prev])
    }

    // событие onclose сработает при отключении
    socket.current.onclose = () => {
      console.log('соединение закрытось');
      setConnected(false)
    }

    // событие onerror сработает при ошибке
    socket.current.onerror = () => {
      console.log('Socket произошла ошибка!');
    }
  }

 
  return (
    <div className="App">
      {
        connected ? (
          <div className="container">
          <div className="control">
            <input 
              type="text" 
              className="message" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
            />
            <button className="send" onClick={sendMessage}>send</button>
          </div>
          <div className="chat">
            {messages.map(item =>
              <div className="message" key={item.id}>
                <div className="author">{
                  item.event === 'connection' ? 
                  <div>пользователь {item.userName} подключился</div>
                  : <div className="message">{item.userName}. {item.message}</div>
                }</div>
              </div>
            )}
          </div>
        </div>
        ) : (
          <div className="container">
          <div className="control">
            <input 
              type="text" 
              className="message" 
              value={userName} 
              onChange={e => setUserName(e.target.value)} 
            />
            <button className="send" onClick={connect}>Войти</button>
          </div>
        </div>
        )
      }
     
    </div>
  );
}

export default App;
