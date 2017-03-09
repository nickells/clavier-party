import Tone from 'tone'
import Players from './players'

class Note {
  constructor (name, $parent, index) {
    const config =
      {
        'oscillator': {
          'detune': 0,
          'type': 'custom',
          'partials': [10, 0, 1, 0],
          'phase': 0,
          'volume': 0
        },
        'envelope': {
          'attack': 0.005,
          'decay': 0.3,
          'sustain': 0.2,
          'release': 1
        },
        'portamento': 0.0,
        'volume': -10
      }
    this.note = name
    this.synth = new Tone.Synth(config).toMaster()
    this.$container = $parent
    this.width = 1000 / 13
    this.position = {
      start: index * this.width,
      end: (index * this.width) + this.width
    }
    this.create()
    this.isPlaying = false
    this.needsUpdating = true
  }

  play () {
    if (!this.isPlaying) {
      this.isPlaying = true
      this.synth.triggerAttackRelease(this.note, '8n')
      this.needsUpdating = true
    }
  }

  create () {
    this.$elem = document.createElement('div')
    this.$elem.classList.add('piano-note')
    const isBlackNote = this.note.indexOf('#') !== -1
    if (isBlackNote) this.$elem.classList.add('is-black')
    this.$container.appendChild(this.$elem)
  }

  render () {
    if (this.isPlaying) {
      if (this.needsUpdating){
        this.$elem.style.borderTopColor = this.whoIsSittingOnMe.color
        this.$elem.style.boxShadow = `0px -20px 50px ${this.whoIsSittingOnMe.color}`
        this.$elem.classList.add('playing')
        this.needsUpdating = false
      }
    } else {
      if (this.needsUpdating) {
        this.$elem.style.boxShadow = `0px 0px 0px rgba(0, 0, 0, 0)`
        this.$elem.classList.remove('playing')
        this.needsUpdating = false
      }
    }
  }

  update () {
    const PADDING = 14
    const someoneIsSittingOnMe = Players.get().some(player => {
      if (player.position.y <= 0) {
        if (
          // entire player contained in note
          (player.position.x >= this.position.start - PADDING && player.position.x + player.size <= this.position.end + PADDING)
          // // player is straddling the note at the end
          // || (player.position.x < this.position.end && player.position.x + player.size > this.position.end)
          // // player is straddling the note at the beginning
          // || (player.position.x + player.size > this.position.start && player.position.x < this.position.start)
        ) {
          this.whoIsSittingOnMe = player
          return true
        }
      }
    })
    if (someoneIsSittingOnMe) this.play()
    else {
      if (this.isPlaying) {
        this.isPlaying = false
        this.needsUpdating = true
      }
    }
  }
}

export default Note
