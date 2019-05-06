const initialState = {
  login_id: null,
  isAuthenticated: false,
}

const UPDATE_LOGIN_ID = "UPDATE_LOGIN_ID"

export function updateLoginId (details) {
  return{
    type: UPDATE_LOGIN_ID,
    payload: details
  }
}



export default function userReducer (state=initialState, action){
  const {type, payload} = action
  switch(type){
    case UPDATE_LOGIN_ID:
      const {login_id, isAuthenticated} = payload
      return {...state, login_id, isAuthenticated};
    default:
      return state
  }
}