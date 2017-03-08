import Keys from './keys'
import Chatbar from './ChatBar'
import fixedTimestepRuntimeLoop from './runtime'


Keys.init()
Chatbar.init()


fixedTimestepRuntimeLoop().runtime()
