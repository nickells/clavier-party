import Keys from './keys'
import Players from './players'

const METER = 30
const GRAVITY = METER * 9.8 * 6 // very exagerated gravity (6x)
const MAXDX = METER * 20 // max horizontal speed (20 tiles per second)
const MAXDY = METER * 60 // max vertical speed(60 tiles per second)
const HORIZONTAL_ACCEL = MAXDX * 2 // horizontal acceleration -  take 1/2 second to reach maxdx
const FRICTION = MAXDX * 6 // horizontal friction  -  take 1/6 second to stop from maxdx
const JUMP = METER * 1500 //

function bound (x, min, max) {
  return Math.max(min, Math.min(max, x))
}

const applyStyles = ($elem, styles) => {
  Object.keys(styles).forEach(key => {
    $elem.style[key] = styles[key]
  })
  return $elem
}

const getEdges = (position, size) => {
  return {
    topRight: {
      x: position.x + size,
      y: position.y + size
    },
    bottomRight: {
      x: position.x + size,
      y: position.y
    },
    bottomLeft: {
      x: position.x,
      y: position.y
    },
    topLeft: {
      x: position.x,
      y: position.x + size
    }
  }
}

class Player {
  constructor (controls) {
    this.player = controls === 'keys' ? 1 : 2
    this.position = {
      x: this.player === 1 ? 0 : 60,
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
    this.size = METER

    this.getEdges = this.getEdges.bind(this)

    const directions = this.player === 1 ? ['left', 'right', 'up'] : ['A', 'D', 'W']
    this.color = this.player === 1 ? 'blue' : 'red'

    directions.forEach(direction => {
      Keys.keydown(direction, () => {
        this.inputs[direction] = true
      })
      Keys.keyup(direction, () => {
        this.inputs[direction] = false
      })
    })

    this.create()

    // todo: this is bad!
    setTimeout(() => {
      this.otherPlayer = this.player === 1 ? Players[0] : Players[1]
    }, 1)
  }

  create () {
    this.$player = document.createElement('div')
    const styles = {
      display: 'inline-block',
      backgroundColor: this.color,
      width: `${this.size}px`,
      height: `${this.size}px`,
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
    const inputLeft = this.inputs.left || this.inputs.A
    const inputRight = this.inputs.right || this.inputs.D
    const inputUp = this.inputs.up || this.inputs.W
    this.accelerationX = 0
    this.accelerationY = GRAVITY

    if (inputLeft) {
      this.accelerationX = this.accelerationX - HORIZONTAL_ACCEL     // player wants to go left
    } else if (wasleft) {
      this.accelerationX = this.accelerationX + FRICTION  // player was going left, but not any more
    }

    if (inputRight) {
      this.accelerationX = this.accelerationX + HORIZONTAL_ACCEL // player wants to go right
    } else if (wasright) {
      this.accelerationX = this.accelerationX - FRICTION  // player was going right, but not any more
    }
    if (inputUp && !this.jumping && !this.falling) {
      this.accelerationY = this.accelerationY - JUMP     // apply an instantaneous (large) vertical impulse
      this.jumping = true
    }

    this.position.y = Math.floor(this.position.y + (step * this.velocityY))
    this.position.x = Math.floor(this.position.x + (step * this.velocityX))
    this.velocityX = bound(this.velocityX + (step * this.accelerationX), -MAXDX, MAXDX)
    this.velocityY = bound(this.velocityY - (step * this.accelerationY), -MAXDY, MAXDY)

    if ((wasleft && (this.velocityX > 0)) ||
      (wasright && (this.velocityX < 0))) {
      this.velocityX = 0 // clamp at zero to prevent friction from making us jiggle side to side
    }

    // don't fall through the ground, or others
    if (this.velocityY <= 0) {
      const isColliding = this.isColliding(this.otherPlayer.getEdges(), this.getEdges())
      if (this.position.y < 0 || isColliding) {
        this.velocityY = 0
        this.jumping = false
        this.falling = false
        if (isColliding) {
          this.position.y = this.otherPlayer.getEdges().topLeft.y
        } else {
          this.position.y = 0
        }
      }
    }

    this.falling = this.position.y < 0
  }

  render (time) {
    this.$player.style.transform = `translate(${this.position.x}px, ${-this.position.y}px)`
  }

  isColliding (otherEdges, thisEdges) {
    return (
      (
        (thisEdges.topLeft.x >= otherEdges.topLeft.x && thisEdges.topLeft.x <= otherEdges.topRight.x)
        || (thisEdges.topRight.x <= otherEdges.topRight.x && thisEdges.topRight.x >= otherEdges.topLeft.x)
      )
      && (this.position.y <= otherEdges.topLeft.y + 1 && this.jumping === true)
    )
  }

  getEdges () {
    const edges = {
      topLeft: {
        x: this.position.x,
        y: this.position.y + this.size
      },
      topRight: {
        x: this.position.x + this.size,
        y: this.position.y + this.size
      },
      // bottomRight: {
      //   x: this.position.x + this.size,
      //   y: this.position.y
      // },
      // bottomLeft: {
      //   x: this.position.x,
      //   y: this.position.y
      // },
    }
    return (edges)
  }
}

export default Player
