import io from 'socket.io-client'
const socket = io(window.location.host)
let connected = false

export const ensureConnect = () => new Promise((resolve, reject) => {
  if (!connected) {
    socket.on('connect', () => {
      connected = true
      resolve(socket)
    })
  } else resolve(socket)
})
