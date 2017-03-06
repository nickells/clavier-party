const express = require('express')
const server = express()

server.get('*', (req, res) => {
  res.send('hey')
})

server.listen('9000')