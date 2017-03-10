import Players from './players'
import Player from './player_physics'

export default {
  spectators: [],
  init () {
    this.activate = this.activate.bind(this)
  },
  activate (id = 0) {
    this.active = true
    Players.getOne(id).spectateActivate()
    this.spectators.push(Players.getOne(id))
  },
  deActivate (id = 0) {
    Players.getOne(id).spectateDeactivate()
    this.spectators.splice(this.spectators.indexOf(Players.getOne(id)), 1)
  }
}
