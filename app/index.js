var app  = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
  console.log('user has connected.')
  socket.on('chat message', (msg) => {
    console.log('message sent: ' + msg)
    io.emit('chat message', msg)
    //write on client side to handle this event
  })
  socket.on('disconnect', () => {
    console.log('user has disconnected')
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})

//we would like to broadcast the message to all the users
//io.emit('some event', { for: 'everyone' });

//socket.broadcast.emit('hi')