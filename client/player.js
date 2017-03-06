// A singleton representing the user

import Keys from './keys'

const applyStyles = ($elem, styles) => {
  Object.keys(styles).forEach(key => {
    $elem.style[key] = styles[key]
  })
  return $elem
}



const TICKS_PER_SECOND = 60

const HEIGHT_ACCERATION = 0.75
const JUMP_DURATION_SECONDS = 0.6 // seconds
const MOVEMENT_PIXELS_PER_SECOND = 500

const JUMP_DURATION_TICKS = TICKS_PER_SECOND * JUMP_DURATION_SECONDS // ticks
const MOVEMENT_SPEED = MOVEMENT_PIXELS_PER_SECOND / TICKS_PER_SECOND // px per tick

const PLAYER_SIZE = 50 // px

const player = {
  position: {
    x: 0,
    y: 0
  },

  inputs: {

  },

  create () {
    this.$player = document.createElement('div')
    const styles = {
      display: 'inline-block',
      width: `${PLAYER_SIZE}px`,
      height: `${PLAYER_SIZE}px`,
      border: '1px solid black',
      position: 'absolute',
      left: 0,
      bottom: 0
    }
    applyStyles(this.$player, styles)

    document.body.appendChild(this.$player)
  },

  jump () {
    const frame = (JUMP_DURATION_TICKS / 2) - this.jumpCounter
    this.position.y += frame * (HEIGHT_ACCERATION + 1.0)
  },

  fall () {
    const frame = this.jumpCounter - (JUMP_DURATION_TICKS / 2)
    this.position.y -= frame * HEIGHT_ACCERATION
  },

  left () {
    this.position.x -= MOVEMENT_SPEED
  },

  right () {
    this.position.x += MOVEMENT_SPEED
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
      if (this.jumpCounter <= JUMP_DURATION_TICKS / 2) {
        this.jump()
      } else if (this.jumpCounter > JUMP_DURATION_TICKS / 2 && this.jumpCounter < JUMP_DURATION_TICKS) {
        this.fall()
      } else if (this.jumpCounter === JUMP_DURATION_TICKS + 1) {
        this.jumpCounter = 0
        this.isJumping = false
      }
    }
  },

  render (time) {
    this.$player.style.transform = `translate(${this.position.x}px, ${-this.position.y}px)`
  }
}

  export default player