import Keys from './keys'
import Players from './players'
import ChatBar from './Chatbar'
import { ensureConnect } from './socket'
import { applyStyles } from './util'
import colorGrid from './colorGrid'

const METER = 30
const GRAVITY = METER * 9.8 * 6 // very exagerated gravity (6x)
const MAXDX = METER * 20 // max horizontal speed (20 tiles per second)
const MAXDY = METER * 60 // max vertical speed(60 tiles per second)
const HORIZONTAL_ACCEL = MAXDX * 2 // horizontal acceleration -  take 1/2 second to reach maxdx
const FRICTION = MAXDX * 6 // horizontal friction  -  take 1/6 second to stop from maxdx
const JUMP = METER * 1500 //
const CONTAINER_SIZE = 1000

const COLLISION = true

function bound (x, min, max) {
  return Math.max(min, Math.min(max, x))
}

class Player {
  constructor (id, position, color) {
    this.id = id
    this.isUser = id === 0

    this.position = position || {
      x: Math.floor(Math.random() * 100),
      y: 0
    }
    this.color = color || colorGrid.pickRandom()

    if (this.isUser) {
      ensureConnect()
      .then((socket) => {
        socket.emit('player_connected', this)
      })
    } else {
      ensureConnect()
      .then((socket) => {
        socket.on('player_input', (id, input, on) => {
          if (id === this.id) {
            this.inputs[input] = on
          }
        })

        socket.on('player_chat', (id, chat) => {
          if (id === this.id) {
            this.say(chat)
          }
        })
        socket.on('player_force_stop', (id) => {
          if (id === this.id) {
            this.forceStop()
          }
        })
        socket.on('player_color_change', (id, color) => {
          if (id === this.id) {
            this.color = color
            this.$player.style.backgroundColor = color
          }
        })
      })
    }



    this.inputs = {

    }

    this.destroy = this.destroy.bind(this)
    this.getEdges = this.getEdges.bind(this)

    // Movement stuff
    this.velocityX = 0
    this.velocityY = 0
    this.accelerationX = 0
    this.accelerationY = 0
    this.jumping = false
    this.falling = true
    this.size = METER

    this.addKeyEvents()
    this.create()
    

    this.$chats = []

  }

  addKeyEvents () {
    if (this.isUser) {
      const directions = ['left', 'right', 'up']
      directions.forEach(direction => {
        Keys.keydown(direction, () => {
          this.inputs[direction] = true
          if (this.isUser) {
            ensureConnect()
            .then(socket => {
              socket.emit('player_input', this.id, direction, true)
            })
          }
        })
        Keys.keyup(direction, () => {
          this.inputs[direction] = false
          if (this.isUser) {
            ensureConnect()
              .then(socket => {
                socket.emit('player_input', this.id, direction, false)
              })
          }
        })
      })
      Keys.keydown('ENTER', () => ChatBar.launch())
    }
  }

  create () {
    this.$player = document.createElement('div')
    const styles = {
      display: 'inline-block',
      boxSizing: 'border-box',
      backgroundColor: this.color,
      width: `${this.size}px`,
      height: `${this.size}px`,
      position: 'absolute',
      cursor: this.isUser ? 'pointer' : 'default',
      left: 0,
      bottom: 0,
      transition: 'background-color 200ms'
    }
    applyStyles(this.$player, styles)

    document.getElementById('game-container').appendChild(this.$player)
    
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
      this.accelerationY = this.accelerationY - JUMP // apply an instantaneous (large) vertical impulse
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
      const isColliding = COLLISION ? this.isColliding() : false
      if (this.position.y < 0 || isColliding) {
        this.velocityY = 0
        this.jumping = false
        this.falling = false
        if (isColliding) {
          this.position.y = this.sittingOnWhom.getEdges().topLeft.y
        } else {
          this.position.y = 0
        }
      }
    }

    if (this.velocityX > 0) {
      if (this.position.x >= (1000 - this.size)){
        this.position.x = 1000 - this.size
        this.velocityX = 0
      }
    } else if (this.velocityX < 0) {
      if (this.position.x <= 0) {
        this.position.x = 0
        this.velocityX = 0
      }
    }

    this.falling = this.position.y < 0
  }

  render (time) {
    this.$player.style.transform = `translate(${this.position.x}px, ${-this.position.y}px)`
    if (this.$chats) {
      this.$chats.forEach($chat => {
        $chat.style.transform = `translate(${this.position.x}px, ${-this.position.y}px)`
      })
    }
  }

  isColliding () {
    let thisEdges = this.getEdges()
    const sittingOnSomeone = Players.get().some(otherPlayer => {
      if (otherPlayer.id === this.id) return false
      let otherEdges = otherPlayer.getEdges()
      let colliding = (
        (thisEdges.topLeft.x >= otherEdges.topLeft.x && thisEdges.topLeft.x <= otherEdges.topRight.x) ||
        (thisEdges.topRight.x <= otherEdges.topRight.x && thisEdges.topRight.x >= otherEdges.topLeft.x)
      ) && (this.position.y <= otherEdges.topLeft.y && this.position.y > otherEdges.bottomLeft.y)
      if (colliding) {
        this.sittingOnWhom = otherPlayer
      } else this.sittingOnWhom = undefined
      return this.sittingOnWhom
    })
    return sittingOnSomeone
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
      bottomLeft: {
        x: this.position.x,
        y: this.position.y
      }
    }
    return (edges)
  }

  destroy () {
    this.$player.remove()
  }

  forceStop () {
    const directions = ['left', 'right', 'up']
    directions.forEach(key => {
      if (this.inputs[key]) this.inputs[key] = false
    })
  }

  removeKeyEvents () {
    if (this.isUser) {
      const directions = ['left', 'right', 'up', 'ENTER']
      directions.forEach(key => Keys.removeListenerFor(key))
    }
  }

  say (val) {
    const $chat = document.createElement('p')
    $chat.classList.add('chatText')
    this.$chats.push($chat)
    this.$player.parentNode.insertBefore($chat, this.$player)
    $chat.innerHTML = val
    setTimeout(() => {
      $chat.remove()
      this.$chats.splice(this.$chats.indexOf($chat), 1)
    }, 2000)
  }
}

export default Player
