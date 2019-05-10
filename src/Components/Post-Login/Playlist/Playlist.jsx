import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import YouTube from 'react-youtube'
import List from './List/List'
import { updateGroupId } from '../../../ducks/groupReducer'
import { updateLoginId } from '../../../ducks/userReducer'

class Playlist extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isHost: false,
      groupInfo: {},
      loading: true,
      noVideos: false,
      currentVideo: '',
      currentGroupPlaylistId: null,
      currentSongId: null,
      ready: false,
      next: 0,
      prevPlayed: []
    }

    
  }

  

  //LOCAL FUNCTIONS

  async componentDidMount() {
    const { joincode } = this.props.match.params
    //GETS THE GROUP ID TO PULL INFO PROPERLY
    let groupId = await axios.post('/api/group/getbycode', { joincode })
    const group_id = groupId.data.group_id
    //PUTS THE CORRECT GROUP ON THE REDUX STORE
    this.props.updateGroupId(group_id)

    //GETS CURRENT USER DETAILS TO CHECK IF THEY ARE HOST
    let userDetails = await axios.get('/auth/getdetails')
    const { firstname, login_id, isAuthenticated } = userDetails.data
    this.setState({
      firstname
    })
    this.props.updateLoginId({ login_id, isAuthenticated })
    //MAKES SURE USER IS ADMIN
    let res = await axios.post('/api/group/checkhost', { login_id, group_id })
    this.setState({
      isHost: res.data
    })

    //FETCHES GROUP INFO TO DISPLAY
    axios.post('/api/group/getbyid', { group_id }).then(res => {
      this.setState({
        groupInfo: res.data
      })
    })

    await this.getPlaylist()

    this.setState({
      ready: true
    })
  }

  getPlaylist = async () => {
    const { group_id } = this.props
    let res = await axios.post('/api/playlist', { group_id })
    let sortedArray = res.data.sort((a, b) => {
      const scoreA = a.score
      const scoreB = b.score
      if (scoreA < scoreB) {
        return 1
      } else {
        return -1
      }
    })

    if(sortedArray.length===0){
      this.setState({
        noVideos: true
      })
    } else {
      let currentSong = sortedArray[0]
      this.setState({
        currentVideo: currentSong.id,
        currentGroupPlaylistId: currentSong.group_playlist_id,
        currentSongId: currentSong.song_id,
        loading: false,
        noVideos: false
      })
    }

  }

  resetVote = async () => {
    const playlistId = this.state.currentGroupPlaylistId
    const group_id = this.props.group_id
    const song_id = this.state.currentSongId
    await axios.post('/api/playlist/reset', {playlistId, group_id, song_id})
    this.setState({
      next: this.state.next += 1
    })
  }

  nextSong = async () => {
    this.setState({
      loading: true,
      next: this.state.next += 1
    })
    await this.resetVote()
    await this.getPlaylist()
  }

  render() {

    let content
    if (this.state.noVideos === true) {
      content = <div>ADD SOME VIDEOS</div>
    } else if (this.state.loading === true) {
      content = <img className='loading' src="https://upload.wikimedia.org/wikipedia/commons/6/66/Loadingsome.gif" alt="loading" />
    } else {
      content = <YouTube videoId={this.state.currentVideo}
        opts={{ playerVars: { autoplay: 1 } }}
        onEnd={this.nextSong} />
    }

    return (

      <div>

        {content}

        {this.state.ready && 
        <List group_id={this.props.group_id} 
        next={this.state.next}
        getPlaylist={this.getPlaylist}/>
        }

      </div>
    )
  }
}

const mapStateToProps = (reduxStore) => {
  return {
    group_id: reduxStore.group.group_id,
    login_id: reduxStore.users.login_id
  }
}

export default connect(mapStateToProps, { updateGroupId, updateLoginId })(Playlist)