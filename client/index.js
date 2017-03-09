import Keys from './keys'
import ChatBar from './ChatBar'
import Piano from './piano'
import fixedTimestepRuntimeLoop from './runtime'
import colorGrid from './colorGrid'

Piano.init()
Keys.init()
ChatBar.init()
colorGrid.init()


fixedTimestepRuntimeLoop().runtime()
