import Players from './players'
import { ensureConnect } from './socket'

const colors16 =  ['black', 'gray', 'maroon', 'red', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'purple', 'fuchsia', 'teal', 'aqua', 'silver', 'white']

export default {
  colors: colors16.filter((color, i) => i % 2 !== 0),
  init () {
    this.$grid = document.getElementById('color-grid')
    this.colors.forEach((color, idx) => {
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
    return this.colors[Math.floor(Math.random() * this.colors.length + 1)]
  }
}
