import Player from './player_physics'
import Players from './players'
import { ensureConnect } from './socket'

const player1 = new Player(0)
// const player2 = new Player('keys')
// const player3 = new Player('static')

Players.push(player1)


ensureConnect().then(socket => {
  console.log('self connected. i am', socket.id)
  // New player has connected
  socket.on('player_connected', (player)=> {
    // Add new player to local players reference
    Players.push(new Player(player.id))
    const thisId = socket.id
    const thisPosition = player1.position
    const reconcilingFor = player.id

    // Gather own position and send to new player
    socket.emit('gather_position', thisId, thisPosition, reconcilingFor)
  })

  // a player is telling us its position
  socket.on('reconcile', (id, position) => {
    Players.push(new Player(id, position))
  })

  socket.on('player_disconnect', id => {

    let idx = 0
    for (let i = 0; i < Players.length; i++) {
      if (Players[i].id === id) {
        idx = i
      }
    }
    Players[idx].destroy()
    Players.splice(idx)
  })
})

function fixedTimestepRuntimeLoop () {
  // Compute stuff here
  function update (step) {
    Players.forEach((player) => player.update(step))
  }

  // Draw stuff here
  function render (timePassed) {
    Players.forEach((player) => player.render(timePassed))
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
