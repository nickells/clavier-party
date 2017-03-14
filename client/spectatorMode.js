import Players from './players'
import { ensureConnect } from './socket'

export default {
  spectators: [],
  init () {
    this.activate = this.activate.bind(this)
    this.deactivate = this.deactivate.bind(this)
    
    this.$alertBox = document.getElementById('alert')
    this.$alertText = this.$alertBox.querySelector('#alert-text')
    this.$button = this.$alertBox.querySelector('#alert-button')
    this.$alertText.innerHTML = 'You have been placed in spectator mode due to inactivity'
    this.$button.innerHTML = 'ok i\'m back'
    this.$button.addEventListener('click', this.closeAlert.bind(this))

    ensureConnect()
    .then(socket => {
      socket.on('player_spectate', (id) => {
        console.log('spectating player', id)
        this.activatePlayer(id)
      })
      socket.on('player_unspectate', (id) => {
        this.deactivatePlayer(id)
      })
    })
  },
  activate (id = 0) {
    this.activatePlayer(id)
    ensureConnect()
    .then(socket => {
      socket.emit('player_spectate', socket.id)
    })
  },
  activatePlayer (id = 0) {
    Players.getOne(id).spectateActivate()
    this.spectators.push(Players.getOne(id))
  },
  deactivate (id = 0) {
    this.deactivatePlayer(id)
    ensureConnect()
    .then(socket => {
      socket.emit('player_unspectate', socket.id)
    })
  },
  deactivatePlayer (id = 0) {
    Players.getOne(id).spectateDeactivate()
    this.spectators.splice(this.spectators.indexOf(Players.getOne(id)), 1)
  },
  closeAlert () {
    Players.user.spectateDeactivate()
    this.$alertBox.classList.remove('active')
  },
  alert () {
    this.$alertBox.classList.add('active')
  }
}
