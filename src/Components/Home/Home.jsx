import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateLoginId } from '../../ducks/userReducer'
import Header from '../Header/Header'

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

  registerRef = React.createRef()

  scrollToRegister = () => {
    window.scrollTo(0, this.registerRef.current.offsetTop)
  }

  handleRegisterFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })

  }

  handleRegisterFormSubmit = async (e) => {
    e.preventDefault()
    const { firstname, lastname, email, password, favoritesong, image } = this.state

    if (this.state.password !== '' && this.state.password !== this.state.confirmpassword) {
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

      <Header/>
        <section id='hero-hold' className='hero-hold'>
          <div className="white-box">
            <h1 className="hero-head">MAKE MUSIC SOCIAL AGAIN</h1>
            <p className="hero-detail">Your friends.  Your playlists.  Your choice.</p>
            <button onClick={this.scrollToRegister} className="to-register">Sign Up Now</button>
          </div>
        </section>


        <section className="register" ref={this.registerRef}>
          <div className='register-instructions'>
            <h1 className="register-instructions-text">Perfect for your workplace, your get-together, or private listening. <br/><br/>
            
            Register and unlock your inner dj</h1>
            
          </div>
          <div className="register-form-hold">
            <form onSubmit={this.handleRegisterFormSubmit} className='register-form'>

              <input type="text" name='firstname' onChange={this.handleRegisterFormUpdate} className='register-input' placeholder='First Name' required />

              <input type="text" placeholder='Last Name' name='lastname' onChange={this.handleRegisterFormUpdate} className='register-input' required />

              
              <input placeholder='Email' type="text" name='email' onChange={this.handleRegisterFormUpdate} className='register-input' required />

              <input placeholder='Password' type="password" name='password' onChange={this.handleRegisterFormUpdate} className='register-input' required />

              <input placeholder='Confirm Password' type="password" name='confirmpassword' onChange={this.handleRegisterFormUpdate} className='register-input' required />
              {this.state.passwordnomatch && <p>Passwords must match</p>}

              <input placeholder='Favorite Song (YouTube url)' type="text" name='favoritesong' onChange={this.handleRegisterFormUpdate} className='register-input' required />


              <button disabled={this.state.formdisable} className='register-button'>Sign up</button>
            </form>
          </div>
        </section>
        <section className="instructions">

        <div className="instructions-text-hold">
        <h1 className="instructions-text">Create your group.  Call it what you want and give it an image</h1>
        </div>

          <img src="https://s3-us-west-1.amazonaws.com/socialplaylists/Hero+Images/create+group+example.PNG" alt="Create Group Example" className='Playlist-Example'/>

          <div className="instructions-text-hold">
        <h1 className="instructions-text">See all of your groups in one place and join your friends' groups</h1>
        </div>

          <img src="https://s3-us-west-1.amazonaws.com/socialplaylists/Hero+Images/groups+example.PNG" alt="Groups example" className='Playlist-Example'/>

          <div className="instructions-text-hold">
        <h1 className="instructions-text">Make your vote count and decide which songs will come next</h1>
        </div>
          
          <img src='https://s3-us-west-1.amazonaws.com/socialplaylists/Hero+Images/Playlist+example.PNG' alt="Playlist example" className='Playlist-Example'/>
          
        </section>
      </div>
    )
  }
}

export default connect(null, { updateLoginId })(withRouter(Home))