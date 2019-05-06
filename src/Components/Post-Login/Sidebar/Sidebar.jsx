import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import {logoutUser} from '../../../ducks/userReducer'


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
      <div>
        Welcome, {this.state.firstname}
        <button onClick={this.handleLogout}>Log Out</button>
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

export default connect(mapStateToProps, {logoutUser})(withRouter(Sidebar))