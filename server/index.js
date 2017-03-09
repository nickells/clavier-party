const express = require('express')
const app = express()
const path = require('path')

const server = require('http').createServer(app)

const favicon = require('serve-favicon')


const io = require('socket.io')(server)

let Players = []

io.on('connection', (socket) => {
  socket.emit('hello')

  // New player has connected
  socket.on('player_connected', (player)=> {
    player.id = socket.id
    // Add player to index
    Players.push(player)
    // Tell everyone else that a player has connected
    socket.broadcast.emit('player_connected', player)
  })

  // Send position to everyone except sender
  socket.on('send_position', (id, player) => {
    const { position, color, velocityX, velocityY } = player
    Players.forEach(player => {
      if (player.id === id) {
        player.position = position
        player.color = color
        player.velocityX = velocityX
        player.velocityY = velocityY
      }
    })

    socket.broadcast.emit('update_position', id, player)
  })

  // Send position to a single player
  socket.on('gather_position', (id, position, reconcilingFor, color) => {

    // Update position of player inside Players collection
    Players.forEach(player => {
      if (player.id === id){
        player.position = position
        player.color = color
      }
    })

    // Send the new player the position of the player
    socket.broadcast.to(reconcilingFor).emit('reconcile', id, position, color )
  })

  socket.on('player_input', (id, input, bool) => {
    socket.broadcast.emit('player_input', socket.id, input, bool )
  })

  socket.on('player_chat', (id, chat) => {
    socket.broadcast.emit('player_chat', id, chat)
  })

  socket.on('player_force_stop', (id) => {
    socket.broadcast.emit('player_force_stop', id)
  })

  socket.on('player_color_change', (id, color) => {
    socket.broadcast.emit('player_color_change', id, color)
  })

  socket.on('disconnect', () => {
    let idx = 0

    for (let i = 0; i < Players.length; i++ ){
      if (Players[i].id === socket.id) {
        idx = i
      }
    }
    Players.splice(idx, 1)
    socket.broadcast.emit('player_disconnect', socket.id)
  })
})

app.use(favicon(path.join(__dirname, '../', 'favicon.png')))
app.use(express.static('dist'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
})

server.listen(process.env.PORT || 9000)
