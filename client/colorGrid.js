import Players from './players'
import { ensureConnect } from './socket'

export default {
  colors: ['black', 'gray', 'maroon', 'red', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'purple', 'fuchsia', 'teal', 'aqua', 'silver', 'white'],
  init () {
    this.$grid = document.getElementById('color-grid')
    this.colors.forEach(color => {
      const $square = document.createElement('div')
      $square.classList.add('color-grid-box')
      $square.style.backgroundColor = color
      this.$grid.appendChild($square)
      $square.addEventListener('click', () => {
        ensureConnect()
        .then(socket => {
          Players.user.$player.style.backgroundColor = color
          Players.user.color = color
          socket.emit('player_color_change', socket.id, color)
        })
      })
    })
  },
  pickRandom () {
    return this.colors[Math.floor(Math.random() * 17)]
  }
}
