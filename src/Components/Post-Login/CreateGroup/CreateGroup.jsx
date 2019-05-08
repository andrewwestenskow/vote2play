import React, {Component} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

class CreateGroup extends Component{

  state={
    groupName: '',
    groupImage: ''
  }

  handleCreateGroup = async (e) => {
    e.preventDefault()
    const {groupName, groupImage} = this.state
    const {login_id} = this.props

    let body = {
      name: groupName,
      require_admin_join: false,
      require_admin_song: false,
      login_id,
      group_image: groupImage
    }

    try {
      await axios.post('/api/group/create', body)
      this.props.history.push(`/${login_id}/dashboard`)

    } catch (error) {
      alert(`Error, please try again`)
    }
  }

  handleCreateGroupFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render(){
    return(
      <div className='Create-Group'>Create GROUP

        <form onSubmit={this.handleCreateGroup}>
          <p>Group Name</p>
          <input type="text" name='groupName' onChange={this.handleCreateGroupFormUpdate} />
          <p>Group Image</p>
          <input type="text" name='groupImage' onChange={this.handleCreateGroupFormUpdate} />
          <button>Create Group</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const {login_id} = reduxState.users
  return{
    login_id
  }
}

export default connect(mapStateToProps)(withRouter(CreateGroup))