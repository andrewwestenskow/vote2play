import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Song from './Song/Song'
import YouTube from 'react-youtube'
import { updateGroupId } from '../../../ducks/groupReducer'
import { updateLoginId } from '../../../ducks/userReducer'
require('dotenv').config()
const {REACT_APP_YOUTUBE_API_KEY} = process.env

class Playlist extends Component {

  state = {
    playlist: [],
    isHost: false,
    groupInfo: {},
    newVideoUrl: '',
    loading: true,
    noVideos: false
  }

  async componentDidMount() {
    const { joincode } = this.props.match.params

    let groupId = await axios.post('/api/group/getbycode', { joincode })

    const group_id = groupId.data.group_id
    //MAKES SURE PLAYLIST LOADS PROPERLY
    this.props.updateGroupId(group_id)

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


    this.updatePlaylist()

    //FETCHES GROUP INFO TO DISPLAY
    axios.post('/api/group/getbyid', { group_id }).then(res => {
      this.setState({
        groupInfo: res.data
      })
    })
  }

  updatePlaylist = async () => {
    const { group_id } = this.props
    await axios.post('/api/playlist', { group_id }).then(res => {
      let sortedArray = res.data.sort((a, b) => {
        const scoreA = a.score
        const scoreB = b.score
        if (scoreA < scoreB) {
          return 1
        } else {
          return -1
        }
      })
      if (sortedArray.length === 0) {
        this.setState({
          noVideos: true,
          loading: false
        })
      } else {
        this.setState({
          playlist: sortedArray,
          loading: false
        })
      }
    })
  }

  nextSong = async () => {
    const oldSong = this.state.playlist[0].group_playlist_id

    
    await axios.post('/api/playlist/reset', { playlistId: oldSong })

    this.updatePlaylist()

  }

  handleNewVideoFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleAddNewVideoFormSubmit = async () => {
    const { group_id } = this.props
    await axios.post('/api/playlist/addsong', { group_id: group_id, songUrl: this.state.newVideoUrl })

    this.setState({
      newVideoUrl: ''
    })

    await axios.post('/api/playlist', { group_id }).then(res => {
      this.setState({
        playlist: res.data
      })
    })
  }

  render() {

    let playlist = this.state.playlist.map(song => {
      return <Song key={song.group_playlist_id}
        playlistId={song.group_playlist_id}
        id={song.id}
        songId={song.song_id}
        songUrl={song.url}
        score={song.score}
        updatePlaylist={this.updatePlaylist} />
    })

    let content
      if(this.state.noVideos === true){
        content = <div>ADD SOME VIDEOS</div>
      } else if (this.state.loading === true){
        content = <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Loadingsome.gif" alt="loading" /> 
      } else {
        content = <YouTube videoId={this.state.playlist[0].id}
          opts={{ playerVars: { autoplay: 1 } }}
          onEnd={this.nextSong} />
      }
    return (

      <div>
        
        {content}

        {playlist}

        <form onSubmit={this.handleAddNewVideoFormSubmit}>
          <input type="text" name='newVideoUrl'
            onChange={this.handleNewVideoFormChange} value={this.state.newVideoUrl} />
          <button>Add</button>
        </form>
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