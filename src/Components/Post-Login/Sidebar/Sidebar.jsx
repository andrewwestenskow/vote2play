import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'
import { logoutUser } from '../../../ducks/userReducer'


class Sidebar extends Component {

  state = {
    firstname: ''
  }

  componentDidMount() {
    axios.get('/auth/getdetails').then(res => {
      const { firstname } = res.data
      this.setState({
        firstname
      })
    }).catch(err => {
      console.log(err)
      this.props.history.push('/')
    })

  }

  handleLogout = async () => {
    await axios.get('/auth/logout')
    this.props.logoutUser()
    this.props.history.push('/')
  }

  render() {
    return (
      <div className='Sidebar'>

        <div className="sidebar-menu-hold">
          Welcome, {this.state.firstname}
          <ul>
            <Link to='/profile'>
              <li>My Profile</li>
            </Link>
            <Link to='/creategroup'>
              <li>Create Group</li>
            </Link>
            <Link to='/joingroup'>
              <li>Join Group</li>
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
  const { isAuthenticated } = reduxState
  return {
    isAuthenticated
  }
}

export default connect(mapStateToProps, { logoutUser })(withRouter(Sidebar))