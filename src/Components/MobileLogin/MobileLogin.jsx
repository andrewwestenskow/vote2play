import React, {Component} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {updateLoginId} from '../../ducks/userReducer'

class MobileLogin extends Component {

  state = {
    loginEmail: '',
    loginPassword: '',
    loginError: false,
    loginErrorMessage: 'Email or Password are incorrect',
  }

  handleFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleLoginFormSubmit = async (e) => {
    e.preventDefault()
    const { loginEmail: email, loginPassword: password } = this.state
    try {
      const user = await axios.post('/auth/login', { email, password })
      this.props.updateLoginId(user.data)
      this.props.history.push(`/${user.data.login_id}/dashboard`)
    } catch (err) {
      this.setState({
        loginEmail: '',
        loginPassword: '',
        loginError: true
      })
    }
  }

  render(){

    return(
      <div className='Mobile-Login'>
        <div className="mobile-login-form-hold">
          <form onSubmit={this.handleLoginFormSubmit} className='mobile-login-form'>

            <input placeholder='Email' 
            type="text" 
            name='loginEmail' 
            value={this.state.loginEmail} 
            onChange={e => this.handleFormUpdate(e)}
            className='login-input' />
            
            <input placeholder='Password' 
            type="password" 
            name='loginPassword' 
            value={this.state.loginPassword} 
            onChange={e => this.handleFormUpdate(e)} 
            className='login-input'/>
            <button className='login-button'>Log In</button>
            {this.state.loginError && <h3>{this.state.loginErrorMessage}</h3>}
          </form>
        </div>
      </div>
    )
  }
}

export default connect(null, {updateLoginId})(withRouter(MobileLogin))