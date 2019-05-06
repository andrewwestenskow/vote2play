import React, {Component} from 'react'
import {connect} from 'react-redux'

class Sidebar extends Component {

  state = {
    firstname: '',
    lastname: ''
  }

  componentDidMount(){
    this.setState({
      firstname: this.props.firstname,
      lastname: this.props.lastname
    })
  }

  render(){
    return(
      <div>
        Welcome, {this.state.firstname}
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const {firstname, lastname} = reduxState
  return {
    firstname,
    lastname
  }
}

export default connect(mapStateToProps)(Sidebar)