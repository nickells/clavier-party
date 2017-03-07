const express = require('express')
const app = express()
const path = require('path')

const server = require('http').createServer(app)

const io = require('socket.io')(server)

let Players = []

io.on('connection', (socket) => {
  socket.emit('hello')

  // New player has connected
  socket.on('player_connected', (player)=> {
    console.log('new player connect', socket.id)
    player.id = socket.id
    // Add player to index
    Players.push(player)
    console.log(Players.length, 'players')
    // Tell everyone else that a player has connected
    socket.broadcast.emit('player_connected', player)
  })

  // A player is sending us its position to tell a new player
  socket.on('gather_position', (id, position, reconcilingFor) => {
    console.log('position gathering for', id)
    console.log('sending to ', reconcilingFor)

    // Update position of player inside Players collection
    Players.forEach(player => {
      if (player.id === id){
        player.position = position
      }
    })

    // Send the new player the position of the player
    socket.broadcast.to(reconcilingFor).emit('reconcile', id, position )
  })


  socket.on('player_input', (id, input, bool) => {
    socket.broadcast.emit('player_input', socket.id, input, bool )
  })
  

  socket.on('disconnect', () => {
    let idx = 0
    for (let i = 0; i < Players.length; i++ ){
      if (Players[i].id === socket.id){
        idx = i
      }
    }
    Players.splice(idx)
    socket.broadcast.emit('player_disconnect', socket.id)
  })
})


app.use(express.static('dist'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
})

server.listen(9000)