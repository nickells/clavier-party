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
    this.position.y += 10
  },

  left () {
    this.position.x -= 10
  },

  right () {
    this.position.x += 10
  },

  init () {
    this.jump = this.jump.bind(this)
    this.left = this.left.bind(this)
    this.right = this.right.bind(this)

    Keys.on('left', this.left)
    Keys.on('right', this.right)
    Keys.on('up', this.jump)

    this.create()
  }
}

  export default player