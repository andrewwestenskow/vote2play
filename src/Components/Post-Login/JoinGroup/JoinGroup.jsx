import React, {Component} from 'react'
import axios from 'axios'


class JoinGroup extends Component{

  state={
    joincode: '',
    joinError: false
  }

  handleJoinFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleJoinGroup = async (e) => {
    e.preventDefault()
    try {
      let body = {
        joincode: this.state.joincode,
        login_id: this.props.login_id
      }
      await axios.post('/api/group/join', body)
      this.setState({
        joincode: ''
      })
      this.props.updateGroups()
    } catch (error) {
      this.setState({
        joinError: true
      })
    }
  }

  render(){
    return(
      <div className='Join-Group'>JOIN GROUP
      <form onSubmit={this.handleJoinGroup}>
      <input type="text" name='joincode' onChange={this.handleJoinFormUpdate} value={this.state.joincode}/>
      <button>Join</button>
      </form>
      {this.state.joinError && <p>Could not join group</p>}
      </div>
    )
  }
}

export default JoinGroup