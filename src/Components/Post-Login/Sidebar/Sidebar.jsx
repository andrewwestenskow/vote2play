import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import axios from 'axios'


class Sidebar extends Component {

  state = {
    firstname: ''
  }

  componentDidMount() {
    try {
      axios.get('/auth/getdetails').then(res => {
        const { firstname } = res.data
        this.setState({
          firstname
        })
      }).catch(err => {
        console.log(err)
        this.props.history.push('/')
      })
    } catch (err) {
      alert(`Please log in`)

      this.props.history.push('/')
    }

  }

  handleLogout = async () => {
    await axios.get('/auth/logout')
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
  const { firstname, lastname, isAuthenticated } = reduxState
  return {
    firstname,
    lastname,
    isAuthenticated
  }
}

export default connect(mapStateToProps)(withRouter(Sidebar))