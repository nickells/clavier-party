import { ensureConnect } from './socket'
import { applyStyles } from './util'
import Keys from './keys'
import Players from './players'

const ChatBar = {
  $bar: document.getElementById('chatbar'),
  $input: document.getElementById('chatbar-input'),
  init () {
    this.launch = this.launch.bind(this)
    this.hide = this.hide.bind(this)
  },

  launch () {
    this.$bar.classList.add('active')
    this.$input.focus()
    Keys.pausePropogation()
    ensureConnect()
      .then(socket => {
        socket.emit('player_force_stop', socket.id)
      })
    Players.user.forceStop()
    Players.user.removeKeyEvents()
    Keys.keydown('ENTER', this.submit.bind(this))
    Keys.keydown('ESCAPE', this.hide.bind(this))
  },

  submit () {
    const value = this.$input.value.trim()
    if (!value) this.hide()
    ensureConnect()
    .then(socket => {
      socket.emit('player_chat', socket.id, value)
    })
    this.hide()
    Players.user.say(value)
  },

  hide () {
    this.$input.blur()
    this.$input.value = ''
    this.$bar.classList.remove('active')
    Players.user.addKeyEvents()

  }
}

export default ChatBar
