import React, {Component} from 'react'
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'


class JoinGroup extends Component{

  state={
    joincode: '',
    joinError: false,
    showForm: false
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
      // this.props.updateGroups()
      window.location.reload()
    } catch (error) {
      this.setState({
        joinError: true
      })
    }
  }

  render(){
    return(
      <div className='Join-Group'>
  <div className='Plus-Hold'>
    <p>Join New Group</p>
      <FontAwesomeIcon icon='plus' className='icon'/>
    </div>
      <form onSubmit={this.handleJoinGroup} className='Join-Form'>
      <input className='Join-Input' type="text" name='joincode' onChange={this.handleJoinFormUpdate} value={this.state.joincode}/>
      <button className='Join-Button'>Join</button>
      </form> 
    
      {this.state.joinError && <p>Could not join group</p>}
      </div>
    )
  }
}

export default JoinGroup