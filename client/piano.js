import Note from './note'

export default {
  init (synth){
    const config = {
      // "oscillator": {
      //   "type": "pwm",
      //   "modulationFrequency": 0.2
      // },
      // "envelope": {
      //   "attack": 0.02,
      //   "decay": 0.1,
      //   "sustain": 0.2,
      //   "release": 0.2,
      // }
    }
    this.noteNames = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5' ]
    this.notes = {

    }
    this.create()
  },

  create () {
    const $piano = document.getElementById('piano')
    this.noteNames.forEach((name, index) => {
      this.notes[name] = new Note(name, $piano, index)
    })
  }
}
