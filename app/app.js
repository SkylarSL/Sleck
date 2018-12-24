var express = require('express')
var app     = express()
var http    = require('http').Server(app)
var io      = require('socket.io')(http)

app.use(express.static('public'));

// =========================== Routing =========================================

// TODO create a node js module just for rerouting this code

//index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html')
})

//html
app.get('/public/html/error.html', (req, res) => {
  res.sendFile(__dirname + '/public/html/error.html')
})

//js
app.get('/public/js/socket.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/socket.js')
})
app.get('/public/js/textfield.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/textfield.js')
})
app.get('/public/js/messages.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/messages.js')
})
app.get('/public/js/sidebar.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/sidebar.js')
})
app.get('/public/js/error.js', (req, res) => {
  res.sendFile(__dirname + '/public/js/error.js')
})

//css
app.get('/public/css/index.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/index.css')
})
app.get('/public/css/messages.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/messages.css')
})
app.get('/public/css/sidebar.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/sidebar.css')
})
app.get('/public/css/textfield.css', (req, res) => {
  res.sendFile(__dirname + '/public/css/textfield.css')
})
app.get('*', (req, res) => {
  res.send('<h1>404</h1>', 404); //send a 404
});

// ====================== Event Handling =======================================

var people = {} //people object, client.id members -> name
var active_users = []
var error_message_stack = [];

// three different actions, join, send, and disconnect
io.on('connection', (client) => {
  console.log('a user has connected.')

  function encode_to_wrapped(msg) {

  }

  function exists_in(arr, elem) {
    var i
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === elem)
        return true
    }
    return false
  }

  client.on('set error message', () => {
    console.log('setting error message')
    client.emit('set error message', error_message_stack.pop())
  })

  client.on('handle errors', (name) => {
    if (exists_in(active_users, name)) {
      client.emit('duplicate user redirect', name) //dup username not allowed
      var msg = 'The username ' + name + ' already exists. Please try something different'
      error_message_stack.push(msg)
    }
    // else if () {} TODO other error catching
    else {
      client.emit('submit')
      // else join after handling check-in
    }
  })

  client.on('join', (name) => {
    people[client.id] = name
    console.log(name + ' has joined the chat')
    io.emit('send-all', name + ' has joined the chat')

    active_users.push(name)
    console.log('users online: ' + active_users)
    client.emit('update-name', name)
    io.emit('update-active', active_users)
  })

  client.on('send', (msg) => {
    if (msg.length > 0) {
      console.log('message sent: ' + msg)
      client.emit('send-self', msg)
      //write on client side to handle this event
      client.broadcast.emit('send-all', people[client.id] + ' - ' + msg)
    }
  })

  client.on('disconnect', () => {
    console.log('user has disconnected')
    var name = people[client.id]
    io.emit('send-all', name + ' has left the chat')

    var index_person = active_users.indexOf(name)
    if (index_person > -1) {
      active_users.splice(index_person, 1)
    }
    console.log('users online: ' + active_users)
    client.emit('update-name', name)
    io.emit('update-active', active_users)
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})
