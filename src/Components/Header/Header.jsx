import React, { Component } from 'react'
import axios from 'axios'
import { updateLoginId } from '../../ducks/userReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

class Header extends Component {

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
      this.setState({
        loginEmail: '',
        loginPassword: '',
        loginError: false
      })
    } catch (err) {
      this.setState({
        loginEmail: '',
        loginPassword: '',
        loginError: true
      })
    }
  }

  render() {
    return (
      <header className='Header'>
        <div className="logo-hold">
          <h1 className='logo'>Social Playlists</h1>
        </div>
        <div className="login-form-hold">{!this.props.isAuthenticated &&
          <form onSubmit={this.handleLoginFormSubmit}>
            <input placeholder='Email' type="text" name='loginEmail' value={this.state.loginEmail} onChange={e => this.handleFormUpdate(e)} />
            
            <input placeholder='Password' type="text" name='loginPassword' value={this.state.loginPassword} onChange={e => this.handleFormUpdate(e)} />
            <button>Log In</button>
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