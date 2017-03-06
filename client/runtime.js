import player from './player_physics'

const $hello = document.getElementById('hello')

function fixedTimestepRuntimeLoop() {
  // Compute stuff here
  function update(step) {
    player.update(step)
  }

  // Draw stuff here
  function render(timePassed) {
    player.render(timePassed)
    $hello.innerHTML = timePassed
  }

  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime()
  }


  // Gameplay interval
  const step = 1 / 60
  let lastTime = timestamp()
  let now
  let deltaTime = 0

  function capSeconds(time) {
    // ensure time passed doesn't exceed one second
    return Math.min(1, (time) / 1000)
  }

  function runtime() {
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