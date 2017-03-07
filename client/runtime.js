import Player from './player_physics'
import Players from './players'

const player1 = new Player('arrow')
const player2 = new Player('keys')
const player3 = new Player('static')
Players.push(player1, player2, player3)

const $hello = document.getElementById('hello')

function fixedTimestepRuntimeLoop () {
  // Compute stuff here
  function update (step) {
    Players.forEach((player) => player.update(step))
  }

  // Draw stuff here
  function render (timePassed) {
    Players.forEach((player) => player.render(timePassed))
    $hello.innerHTML = `
      <p>Player 1: ${Players[0].position.x} ${Players[0].position.y}</p>
      <p>Player 2: ${Players[1].position.x} ${Players[1].position.y}</p>
      <pre spacing="default">${JSON.stringify(Players[0].getEdges())}</pre>
      <pre spacing="default">${JSON.stringify(Players[1].getEdges())}</pre>
    `
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
