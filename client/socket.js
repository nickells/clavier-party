import io from 'socket.io-client'
const socket = io('http://localhost:9000')
let connected = false

export const ensureConnect = () => new Promise((resolve, reject) => {
  if (!connected) {
    socket.on('connect', () => {
      connected = true
      resolve(socket)
    })
  } else resolve(socket)
})
