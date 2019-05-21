import React, { Component } from 'react'
import axios from 'axios'
import { updateLoginId } from '../../ducks/userReducer'
import {ClipLoader} from 'react-spinners'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class Header extends Component {

  state = {
    loginEmail: '',
    loginPassword: '',
    loginError: false,
    loginErrorMessage: 'Email or Password are incorrect',
    loading: false
  }

  handleFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleLoginFormSubmit = async (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    const { loginEmail: email, loginPassword: password } = this.state
    try {
      const user = await axios.post('/auth/login', { email, password })
      this.props.updateLoginId(user.data)
      this.props.history.push(`/${user.data.login_id}/dashboard`)
    } catch (err) {
      this.setState({
        loginEmail: '',
        loginPassword: '',
        loginError: true,
        loading: false
      })
    }
  }

  render() {
    return (
      <header className='Header'>
        <div className="logo-hold">
          <img src='https://s3-us-west-1.amazonaws.com/socialplaylists/Hero+Images/v2ptext.png' alt="Vote 2 Play" className='logo-image'/>
          {/* <h1 className='logo'>Social Playlists</h1> */}
        </div>


        <div className="login-form-hold">{!this.props.isAuthenticated &&
          <form onSubmit={this.handleLoginFormSubmit} className='login-form'>

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
            {!this.state.loading ? <button className='login-button'>Log In</button> : 
          <ClipLoader/>}
            {this.state.loginError && <h3>{this.state.loginErrorMessage}</h3>}
          </form>}
        </div>
      </header>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const { isAuthenticated } = reduxState.users
  return {
    isAuthenticated
  }
}

export default connect(mapStateToProps, { updateLoginId })(withRouter(Header))