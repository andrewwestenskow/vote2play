const initialState = {
  playlist: []
}

const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST'

export function updatePlaylist (details) {
  return{
    type: UPDATE_PLAYLIST,
    payload: details
  }
}

export default function playlistReducer (state = initialState, action) {
  const{type, payload} = action
  switch(type){
    case UPDATE_PLAYLIST:
      return{...state, playlist: payload};
    default:
      return{...state}
  }
}