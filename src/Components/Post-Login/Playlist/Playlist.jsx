import React, {Component} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'

class Playlist extends Component{

  state = {
    playlist: [],
    isHost: false,
    groupInfo: {}
  }

  componentDidMount() {
    const {login_id, group_id} = this.props
    axios.post('/api/group/checkhost', {login_id, group_id}).then(res=> {
      this.setState({
        isHost: res.data
      })
    })
    axios.post('/api/playlist', {group_id}).then(res => {
      this.setState({
        playlist: res.data
      })
    })
    axios.post('/api/group/getbyid', {group_id}).then(res => {
      this.setState({
        groupInfo: res.data
      })
    })
  }

  render(){
    return(
      <div>Playlist</div>
    )
  }
}

const mapStateToProps = (reduxStore) => {
  return{
    group_id: reduxStore.group.group_id,
    login_id: reduxStore.users.login_id
  }
}

export default connect(mapStateToProps)(Playlist)