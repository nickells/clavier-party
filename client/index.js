import Keys from './keys'
import fixedTimestepRuntimeLoop from './runtime'
import io from 'socket.io-client'

const socket = io('http://localhost:9000')
socket.on('connect', function () {
  console.log(socket)
})

Keys.init()

fixedTimestepRuntimeLoop().runtime()
