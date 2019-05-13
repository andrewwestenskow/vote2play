import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import { logoutUser, updateLoginId } from '../../../ducks/userReducer'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


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
          <h1 className="welcome-message">
            Welcome, {this.state.firstname}
          </h1>
          <div className="white-line"></div>
          <nav>
            <ul className='sidebar-nav'>
              <Link to={`/${this.props.login_id}/dashboard`} className='link'>
                <li className='sidebar-nav-link'>
                  My Groups
                </li>
              </Link>
              <Link to={`/${this.props.login_id}/profile`} className='link'>
                <li className='sidebar-nav-link'>
                  My Profile
                </li>
              </Link>
              <Link to={`/${this.props.login_id}/creategroup`} className='link'>
                <li className='sidebar-nav-link'>
                  Create Group
                </li>
              </Link>
              <li className='sidebar-nav-link' onClick={this.handleLogout}>
                Logout
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