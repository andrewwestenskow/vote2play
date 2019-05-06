const initialState = {
  login_id: null,
  isAuthenticated: false,
}

const UPDATE_LOGIN_ID = "UPDATE_LOGIN_ID"
const LOGOUT_USER = 'LOGOUT_USER'

export function updateLoginId (details) {
  return{
    type: UPDATE_LOGIN_ID,
    payload: details
  }
}

export function logoutUser () {
  return{
    type: LOGOUT_USER,
    payload: {
      login_id: null,
      isAuthenticated: false
    }
  }
}



export default function userReducer (state=initialState, action){
  const {type, payload} = action
  switch(type){
    case UPDATE_LOGIN_ID:
      const {login_id, isAuthenticated} = payload
      return {...state, login_id, isAuthenticated};
    case LOGOUT_USER: 
      return{...state, login_id: null, isAuthenticated: false}
    default:
      return state
  }
}