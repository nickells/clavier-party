const express = require('express')
const path = require('path');

const server = express()

server.use(express.static('dist'))
server.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'));
})

server.listen('9000')