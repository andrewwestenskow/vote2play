import {createStore, combineReducers} from 'redux'
import userReducer from './ducks/userReducer'
import groupReducer from './ducks/groupReducer'
import playlistReducer from './ducks/playlistReducer'
import {devToolsEnhancer} from 'redux-devtools-extension'

const rootReducer = combineReducers({
  users: userReducer,
  group: groupReducer,
  playlist: playlistReducer
})



export default createStore(rootReducer, devToolsEnhancer())