import ws , { WebSocketServer } from 'ws'
// создаем webSocket server

// создаем экземпляр webSocket сервера
// В конструктор передаем объект с конфигурацией
// и callBack который будет запущен при старте сервера
const webSocketSrv = new WebSocketServer({ 
    port: 5000,
}, () => console.log('Server started on port 5000'))
// далее создаем слушатель события connection, при 
// котором будет запускаться callBack
webSocketSrv.on('connection', function connection(ws) {
    // callBack принимает в качестве аргумента webSocket (какой-то конкретное подключение)
    ws.on('message', (message) => {
        // поскольку обмен сообщениями будет происходить в строковом формате
        // мы сразу из JSON строки перегоняем сообщение в JSON объект
        message = JSON.parse(message)
        // Дальше проверяем какое событие у нас сработало (присоединение или отправка сообщения)
        switch (message.event){
            case 'message':
                broadCastMessage(message)
                break
            case 'connection':
                broadCastMessage(message)
                break

        }
    })
})
// реализуем функцию которая будет отправлять сообщение всем подключенным
const broadCastMessage = (message) => {
    // обращаемся к нашему webSocket серверу и обращаемся ко всем подключившимся клиентам
    webSocketSrv.clients.forEach(client => {
        // каждый клиент так же является websocket-ом
        // Поэтому нам доступен метод send
        client.send(JSON.stringify(message))

    })
}