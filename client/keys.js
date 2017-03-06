const Keys = {
  map: {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  },

  actions: {

  },

  init () {
    window.addEventListener('keydown', (e) => {
      const keyCode = e.which
      const key = this.map[keyCode]
      if (this.actions[key]) this.actions[key]()
    })

    this.on = this.on.bind(this)
  },

  on (key, func) {
    this.actions[key] = func
  }

}

export default Keys