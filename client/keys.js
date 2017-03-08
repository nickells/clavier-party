const Keys = {
  map: {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    87: 'W',
    65: 'A',
    83: 'S',
    68: 'D',
    32: 'SPACE',
    13: 'ENTER'
  },

  keyDownActions: {

  },

  keyUpActions: {

  },

  init () {
    window.addEventListener('keydown', (e) => {
      const keyCode = e.which
      const key = this.map[keyCode]
      if (this.keyDownActions[key]) this.keyDownActions[key]()
    })

    window.addEventListener('keyup', (e) => {
      const keyCode = e.which
      const key = this.map[keyCode]
      if (this.keyUpActions[key]) this.keyUpActions[key]()
    })

  },

  keydown (key, func) {
    this.keyDownActions[key] = func
  },

  keyup (key, func) {
    this.keyUpActions[key] = func
  },

  removeListenerFor (key) {
    if (this.keyDownActions[key]) this.keyDownActions[key] = {}
    if (this.keyUpActions[key]) this.keyUpActions[key] = {}
  },

  pausePropogation () {
    this.cachedKeyDownActions = Object.assign({}, this.keyDownActions)
    this.cachedKeyUpActions = Object.assign({}, this.keyUpActions)
    this.keyDownActions = {}
    this.keyUpActions = {}

  },

  resumePropogation () {
    this.keyDownActions = this.cachedKeyDownActions
    this.cachedKeyDownActions = undefined

    this.keyUpActions = this.cachedKeyUpActions
    this.cachedKeyDownActions = undefined
  }

}

export default Keys
