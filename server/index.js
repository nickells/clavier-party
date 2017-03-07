const express = require('express')
const app = express()
const path = require('path')

const server = require('http').createServer(app)

const io = require('socket.io')(server)

io.on('connection', (...args) => {
  console.log('new connection!')
  console.log(args)
})

app.use(express.static('dist'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
})

server.listen(9000)