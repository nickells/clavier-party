import Keys from './keys'
import Chatbar from './ChatBar'
import Piano from './piano'
import fixedTimestepRuntimeLoop from './runtime'
import colorGrid from './colorGrid'

Piano.init()
Keys.init()
Chatbar.init()
colorGrid.init()


fixedTimestepRuntimeLoop().runtime()
