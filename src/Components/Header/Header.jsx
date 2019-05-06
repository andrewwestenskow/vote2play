import React, {Component} from 'react'
import './Header.scss'
import axios from 'axios'
import {updateUserDetails, updateLoginId} from '../../ducks/userReducer'
import {connect} from 'react-redux'

class Header extends Component {

  state = {
    loginEmail: '',
    loginPassword: ''
  }

  handleFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleLoginFormSubmit = async (e) => {
    e.preventDefault()
    const {loginEmail: email, loginPassword: password} = this.state
    try {
      const user = await axios.post('/auth/login', {email, password})
      const details = await axios.get('/auth/getdetails')
      this.props.updateLoginId(user.data)
      this.props.updateUserDetails(details.data)
    } catch (err) {
      console.log(err)
      this.setState({
        loginEmail: '',
        loginPassword: ''
      })
    }
  }

  render(){
    return(
      <header>

        <form onSubmit={this.handleLoginFormSubmit}>
          <input placeholder='Email' type="text" name='loginEmail' value={this.state.loginEmail} onChange={e => this.handleFormUpdate(e)}/>
          <input placeholder='Password' type="text" name='loginPassword' value={this.state.loginPassword} onChange={e => this.handleFormUpdate(e)}/>
          <button>Log In</button>
        </form>
      </header>
    )
  }
}



export default connect(null, {updateUserDetails, updateLoginId})(Header)