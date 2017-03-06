const METER = 30
const GRAVITY = METER * 9.8 * 6    // very exagerated gravity (6x)
const MAXDX = METER * 20         // max horizontal speed (20 tiles per second)
const MAXDY = METER * 60         // max vertical speed   (60 tiles per second)
const HORIZONTAL_ACCEL = MAXDX * 2          // horizontal acceleration -  take 1/2 second to reach maxdx
const FRICTION = MAXDX * 6          // horizontal friction     -  take 1/6 second to stop from maxdx
const JUMP = METER * 1500       // (

function bound (x, min, max) {
  return Math.max(min, Math.min(max, x));
}

import Keys from './keys'

const applyStyles = ($elem, styles) => {
  Object.keys(styles).forEach(key => {
    $elem.style[key] = styles[key]
  })
  return $elem
}

class Player {

  constructor () {
    this.position = {
      x: 0,
      y: 0
    }

    this.inputs = {

    }

    this.velocityX = 0
    this.velocityY = 0
    this.accelerationX = 0
    this.accelerationY = 0
    this.jumping = false
    this.falling = true

    const directions = ['left', 'right', 'up']

    directions.forEach(direction => {
      Keys.keydown(direction, () => {
        this.inputs[direction] = true
      })
      Keys.keyup(direction, () => {
        this.inputs[direction] = false
      })
    })

    this.create()
  }

  create () {
    this.$player = document.createElement('div')
    const styles = {
      display: 'inline-block',
      width: `${METER}px`,
      height: `${METER}px`,
      border: '1px solid black',
      position: 'absolute',
      left: 0,
      bottom: 0
    }
    applyStyles(this.$player, styles)

    document.body.appendChild(this.$player)
  }

  update (step) {
    const wasleft = this.velocityX < 0
    const wasright = this.velocityX > 0
    this.accelerationX = 0
    this.accelerationY = GRAVITY


    if (this.inputs.left) {
      this.accelerationX = this.accelerationX - HORIZONTAL_ACCEL     // player wants to go left
    } else if (wasleft) {
      this.accelerationX = this.accelerationX + FRICTION  // player was going left, but not any more
    }

    if (this.inputs.right) {
      this.accelerationX = this.accelerationX + HORIZONTAL_ACCEL // player wants to go right
    } else if (wasright) {
      this.accelerationX = this.accelerationX - FRICTION  // player was going right, but not any more
    }
    if (this.inputs.up && !this.jumping && !this.falling) {
      this.accelerationY = this.accelerationY - JUMP     // apply an instantaneous (large) vertical impulse
      this.jumping = true
    }

    this.position.y = Math.floor(this.position.y + (step * this.velocityY))
    this.position.x = Math.floor(this.position.x + (step * this.velocityX))
    this.velocityX = bound(this.velocityX + (step * this.accelerationX), -MAXDX, MAXDX)
    this.velocityY = bound(this.velocityY + (step * this.accelerationY), -MAXDY, MAXDY)

    if ((wasleft && (this.velocityX > 0)) ||
      (wasright && (this.velocityX < 0))) {
      this.velocityX = 0 // clamp at zero to prevent friction from making us jiggle side to side
    }

    if (this.velocityY >= 0) {
      if (this.position.y > 0) {
        this.velocityY = 0
        this.falling = false
        this.jumping = false
        this.position.y = 0
      }
    }

    this.falling = this.position.y < 0
  }

  render (time) {
    this.$player.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
  }
}

export default new Player()