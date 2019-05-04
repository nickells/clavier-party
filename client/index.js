import Keys from './keys'
import ChatBar from './ChatBar'
import Piano from './piano'
import fixedTimestepRuntimeLoop from './runtime'
import colorGrid from './colorGrid'

const startButton = document.getElementById('start')
startButton.addEventListener('click', () => {
  startButton.parentNode.removeChild(startButton)

  Piano.init()
  Keys.init()
  ChatBar.init()
  colorGrid.init()

  fixedTimestepRuntimeLoop().runtime()
})
