import * as Test from './test'
import Keys from './keys'
import Player from './player'
import fixedTimestepRuntimeLoop from './runtime'

Keys.init()
Player.init()

fixedTimestepRuntimeLoop().runtime()
