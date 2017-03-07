const Keys = {
  map: {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    87: 'W',
    65: 'A',
    83: 'S',
    68: 'D'
  },

  keydownActions: {

  },

  keyUpActions: {

  },

  init () {
    window.addEventListener('keydown', (e) => {
      const keyCode = e.which
      const key = this.map[keyCode]
      if (this.keydownActions[key]) this.keydownActions[key]()
    })

    window.addEventListener('keyup', (e) => {
      const keyCode = e.which
      const key = this.map[keyCode]
      if (this.keyUpActions[key]) this.keyUpActions[key]()
    })

    this.keydown = this.keydown.bind(this)
  },

  keydown (key, func) {
    this.keydownActions[key] = func
  },

  keyup (key, func) {
    this.keyUpActions[key] = func
  }

}

export default Keys
