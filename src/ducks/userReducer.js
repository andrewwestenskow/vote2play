const initialState = {
  login_id: null,
  isAuthenticated: false,
  firstname: '',
  lastname: '',
  email: '',
  favoritesong: '',
  image: ''
}

const UPDATE_USER_DETAILS = 'UPDATE_USER_DETAILS'
const UPDATE_LOGIN_ID = "UPDATE_LOGIN_ID"

export function updateUserDetails (details) {
  return {
    type: UPDATE_USER_DETAILS,
    payload: details
  }
}

export function updateLoginId (details) {
  return{
    type: UPDATE_LOGIN_ID,
    payload: details
  }
}

export default function userReducer (state=initialState, action){
  const {type, payload} = action
  switch(type){
    case UPDATE_USER_DETAILS:
      const {firstname, lastname, email, favoritesong, image} = payload
      return {...state, firstname, lastname, email, favoritesong, image};
    case UPDATE_LOGIN_ID:
      const {login_id, isAuthenticated} = payload
      return {...state, login_id, isAuthenticated}
    default:
      return state
  }
}