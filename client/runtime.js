import Player from './player_physics'
import Players from './players'
import Piano from './piano'
import { ensureConnect } from './socket'

const player1 = new Player(0)
// const player2 = new Player('keys')
// const player3 = new Player('static')

Players.add(player1)


ensureConnect().then(socket => {
  // New player has connected
  socket.on('player_connected', (player)=> {
    // Add new player to local players reference
    Players.add(new Player(player.id, player.position, player.color))
    const thisId = socket.id
    const thisPosition = player1.position
    const reconcilingFor = player.id

    // Gather own position and send to new player
    socket.emit('gather_position', thisId, thisPosition, reconcilingFor, player1.color)
  })

  // a player is telling us its position & color
  socket.on('reconcile', (id, position, color) => {
    if (!Players.containsId(id)){
      Players.add(new Player(id, position, color))
    } else {
      Players.getOne(id).position = position
    }
  })

  socket.on('player_disconnect', id => {

    let idx = 0
    for (let i = 0; i < Players.get().length; i++) {
      if (Players.get()[i].id === id) {
        idx = i
      }
    }
    Players.removeIndex(idx)
  })

  setInterval(() => {
    Players.getOthers().forEach(player => {
      socket.emit('gather_position', socket.id, Players.user.position, player.id, Players.user.color)
    })
  }, 500)
})

function fixedTimestepRuntimeLoop () {
  // Compute stuff here
  function update (step) {
    Players.get().forEach((player) => player.update(step))
    Object.keys(Piano.notes).forEach(note => Piano.notes[note].update())
  }

  // Draw stuff here
  function render (timePassed) {
    Players.get().forEach((player) => player.render(timePassed))
    Object.keys(Piano.notes).forEach(note => Piano.notes[note].render())
  }

  function timestamp () {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
  }

  // Gameplay interval
  const step = 1 / 60
  let lastTime = timestamp()
  let now
  let deltaTime = 0

  function capSeconds (time) {
    // ensure time passed doesn't exceed one second
    return Math.min(1, (time) / 1000)
  }

  function runtime () {
    now = timestamp()
    // recompute ∆time
    deltaTime = deltaTime + capSeconds(now - lastTime)

    // "catch up" if time between frames has exceeded our update step
    while (deltaTime > step) {
      deltaTime = deltaTime - step
      update(step)
    }

    render(deltaTime)
    lastTime = now
    requestAnimationFrame(runtime)
  }

  return {
    runtime
  }
}

export default fixedTimestepRuntimeLoop
