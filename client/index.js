import Keys from './keys'
import ChatBar from './ChatBar'
import Piano from './piano'
import fixedTimestepRuntimeLoop from './runtime'
import colorGrid from './colorGrid'
import spectatorMode from './spectatorMode'

spectatorMode.init()

window.testOn = spectatorMode.activate
window.testOff = spectatorMode.deActivate

Piano.init()
Keys.init()
ChatBar.init()
colorGrid.init()


fixedTimestepRuntimeLoop().runtime()
