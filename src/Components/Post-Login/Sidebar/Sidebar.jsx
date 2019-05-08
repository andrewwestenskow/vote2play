import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import { logoutUser, updateLoginId } from '../../../ducks/userReducer'


class Sidebar extends Component {

  state = {
    firstname: ''
  }

  async componentDidMount() {
    let userDetails = await axios.get('/auth/getdetails')
    const { firstname, login_id, isAuthenticated } = userDetails.data
    this.setState({
      firstname
    })
    this.props.updateLoginId({login_id, isAuthenticated})


    if (this.props.login_id === null) {
      this.props.history.push('/')
    }

  }

  handleLogout = async () => {
    await axios.get('/auth/logout')
    this.props.logoutUser()
    this.props.history.push('/')
  }

  render() {

    const { login_id: id } = this.props
    return (
      <div className='Sidebar'>

        <div className="sidebar-menu-hold">
          Welcome, {this.state.firstname}
          <ul>
            <Link to={`/${id}/dashboard`}>
              <li>Dashbaord</li>
            </Link>
            <Link to={`/${id}/profile`}>
              <li>My Profile</li>
            </Link>
            <Link to={`/${id}/creategroup`}>
              <li>Create Group</li>
            </Link>
            <li onClick={this.handleLogout}>Logout</li>
          </ul>
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