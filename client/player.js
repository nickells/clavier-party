// A singleton representing the user

import Keys from './keys'

const applyStyles = ($elem, styles) => {
  Object.keys(styles).forEach(key => {
    $elem.style[key] = styles[key]
  })
  return $elem
}

const player = {
  position: {
    x: 0,
    y: 0
  },

  inputs: {

  },

  getDOMElement () {
    return this.$player
  },

  create () {
    this.$player = document.createElement('div')
    const styles = {
      display: 'inline-block',
      width: '30px',
      height: '30px',
      border: '1px solid black',
      position: 'absolute',
      left: 0,
      bottom: 0
    }
    applyStyles(this.$player, styles)

    document.body.appendChild(this.$player)
  },

  jump () {
    const distance = 10 - this.jumpCounter
    this.position.y += distance
    console.log(this.position.y)
  },

  left () {
    this.position.x -= 10
  },

  right () {
    this.position.x += 10
  },

  fall () {
    const distance = this.jumpCounter - 10
    this.position.y -= distance
    console.log(this.position.y)
  },

  init () {
    ['left', 'right', 'up'].forEach(direction => {
      Keys.keydown(direction, () => {
        this.inputs[direction] = true
      })
      Keys.keyup(direction, () => {
        this.inputs[direction] = false
      })
    })
    this.create()
  },

  // runtime methods
  update (step) {
    if (this.inputs.left) this.left()
    if (this.inputs.right) this.right()
    if (this.inputs.up) {
      if (!this.isJumping) {
        this.jumpCounter = 0
        this.isJumping = true
      }
    }
    if (this.isJumping) {
      this.jumpCounter += 1
      if (this.jumpCounter <= 10) {
        this.jump()
      } else if (this.jumpCounter > 10 && this.jumpCounter < 20) {
        this.fall()
      } else if (this.jumpCounter === 21) {
        this.jumpCounter = 0
        this.isJumping = false
      }
    }
  },

  render (time) {
    this.$player.style.left = this.position.x
    this.$player.style.bottom = this.position.y
  }
}

  export default player