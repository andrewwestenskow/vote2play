const initialState = {
  group_id: null,
  isHost: false
}

const UPDATE_GROUP_ID = 'UPDATE_GROUP_ID'

export function updateGroupId (details) {
  return {
    type: UPDATE_GROUP_ID,
    payload: details
  }
}

export default function groupReducer (state=initialState, action) {
  const {type, payload} = action
  switch(type) {
    case UPDATE_GROUP_ID:
      return {...state, group_id: payload}
    default:
      return{...state}
  }
}