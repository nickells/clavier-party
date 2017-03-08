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
    Players.user.forceStop()
    Players.user.removeKeyEvents()
    Keys.keydown('ENTER', this.submit.bind(this))
  },

  submit () {
    this.hide()
    this.$input.blur()
    Players.user.say(this.$input.value)
    this.$input.value = ''
    Players.user.addKeyEvents()
  },

  hide () {
    this.$bar.classList.remove('active')
  }
}

export default ChatBar
