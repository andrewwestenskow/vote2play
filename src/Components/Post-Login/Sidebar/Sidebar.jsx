import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import { logoutUser, updateLoginId } from '../../../ducks/userReducer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Sidebar extends Component {

  state = {
    firstname: ''
  }

  async componentDidMount() {
    try {
      let userDetails = await axios.get('/auth/getdetails')
      const { firstname, login_id, isAuthenticated } = userDetails.data
      this.setState({
        firstname
      })
      this.props.updateLoginId({ login_id, isAuthenticated })
    } catch (error) {
      // console.log(error)
      this.props.history.push('/')
    }

  }

  handleLogout = async () => {
    await axios.get('/auth/logout')
    this.props.logoutUser()
    this.props.history.push('/')
  }

  render() {

    // const { login_id: id } = this.props
    return (
      <div className='Sidebar'>

        <div className="sidebar-menu-hold">
          <img src="https://s3-us-west-1.amazonaws.com/socialplaylists/Hero+Images/v2p.png" alt="vote 2 play" className='hero-logo'/>


          <h1 className="welcome-message">
            Welcome, {this.state.firstname}
          </h1>
          <div className="white-line"></div>
          <nav>
            
            <ul className='sidebar-nav'>
              <Link to={`/${this.props.login_id}/dashboard`} className='link'>
                <li className='sidebar-nav-link'>
                  <FontAwesomeIcon icon="users" />
                  <span className="sidebar-nav-text">
                    My Groups
                  </span>
                </li>
              </Link>
              <Link to={`/${this.props.login_id}/profile`} className='link'>
                <li className='sidebar-nav-link'>
                  <FontAwesomeIcon icon='user' />
                  <span className="sidebar-nav-text">
                    My Profile
                  </span>
                </li>
              </Link>
              <Link to={`/${this.props.login_id}/creategroup`} className='link'>
                <li className='sidebar-nav-link'>
                  <FontAwesomeIcon icon='plus-square' />
                  <span className="sidebar-nav-text">
                    Create Group
                  </span>
                </li>
              </Link>
              <li className='sidebar-nav-link' onClick={this.handleLogout}>
                <span className="logout-text">Logout</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="children">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const { isAuthenticated, login_id } = reduxState.users
  return {
    isAuthenticated,
    login_id
  }
}

export default connect(mapStateToProps, { logoutUser, updateLoginId })(withRouter(Sidebar))