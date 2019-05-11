import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import {connect } from 'react-redux'
import {updateLoginId} from '../../ducks/userReducer'

class Home extends Component {

  state = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    passwordnomatch: false,
    favoritesong: '',
    image: '',
    formdisable: false
  }

  handleRegisterFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })

  }

  handleRegisterFormSubmit = async (e) => {
    e.preventDefault()
    const { firstname, lastname, email, password, favoritesong, image } = this.state

    if(this.state.password !== '' && this.state.password !== this.state.confirmpassword) {
      this.setState({
        passwordnomatch: true
      })
    } else {
      this.setState({
        passwordnomatch: false
      })
      try {
        let response = await axios.post('/auth/register', { firstname, lastname, email, favoritesong, image, password })
  
        let login_id = response.data.login_id
        this.props.updateLoginId(response.data)
        this.props.history.push(`/${login_id}/dashboard`)
      } catch (err) {
        console.log(err)
      }
    }

    
  }



  render() {
    return (
      <div>
        <section id='hero-hold' className='hero-hold'>
          <div className="white-box">
            <h1 className="hero-head">MAKE MUSIC SOCIAL AGAIN</h1>
            <a href="#register"><button className="to-register">Sign Up Now</button></a>
          </div>
        </section>
        <section id="register">
          <form onSubmit={this.handleRegisterFormSubmit}>

            <p>First Name</p>
            <input type="text" name='firstname' onChange={this.handleRegisterFormUpdate} required/>

            <p>Last Name</p>
            <input type="text" name='lastname' onChange={this.handleRegisterFormUpdate} required/>

            <p>Email</p>
            <input type="text" name='email' onChange={this.handleRegisterFormUpdate} required/>

            <p>Password</p>
            <input type="password" name='password' onChange={this.handleRegisterFormUpdate} required/>

            <p>Confirm Password</p>
            <input type="password" name='confirmpassword' onChange={this.handleRegisterFormUpdate} required />
            {this.state.passwordnomatch && <p>Passwords must match</p>}

            <p>{`Favorite Song (YouTube URL)`}</p>
            <input type="text" name='favoritesong' onChange={this.handleRegisterFormUpdate} required/>


            <button disabled={this.state.formdisable}>Sign up</button>
          </form>
        </section>
        <section id="instructions">
          <div className="instructions-hold">INSTRUCTIONS</div>
        </section>
      </div>
    )
  }
}

export default connect(null, {updateLoginId})(withRouter(Home))