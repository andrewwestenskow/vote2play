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
      song: 0,
      tuneIn: 0,
      tuneInPlayer: false,
      playlist: []
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
    const { firstname, login_id, isAuthenticated, favoritesong } = userDetails.data
    this.setState({
      firstname,
      favoritesong
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

    if (sortedArray.length === 0) {
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
    await axios.post('/api/playlist/reset', { playlistId, group_id, song_id })
    this.setState({
      next: this.state.next += 1
    })
  }

  nextSong = async () => {
    this.setState({
      currentSong: '',
      next: this.state.next += 1
    })
    await this.resetVote()
    await this.getPlaylist()
  }

  setPlaylist = (videos) => {
    let playlist = videos.map(video => video.details.id)
    this.setState({
      playlist: playlist
    })
  }

  addFavorite = () => {
    this.setState({
      song: 1
    })
  }

  tuneIn = () => {
    let num = this.state.tuneIn
    this.setState({
      tuneIn: ++num
    })
  }

  setVideoState = (e) => {
    this.setState({
      videoState: e.target
    })
  }

  setTuneInVideoState = (e) => {
    this.setState({
      videoState: e.target
    })
    e.target.seekTo(this.state.timecode + 1.35)
  }

  tuneInPlayer = (timecode) => {
    this.setState({
      tuneInPlayer: true,
      timecode: timecode
    })
    
  }


  render() {

    let content
    let toShow
    if (this.state.noVideos === true) {
      content = 
      <div className='no-video-hold'>
      <h1 className="no-video-text">Add some songs</h1>
      <></>
      <button onClick={this.addFavorite}>Add your favorite song</button>
      </div>
    } else if (this.state.loading === true) {
      content = <img className='loading' src="https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif" alt='loading gif' />
    } else {
      content =
      //HOST PLAYER
        <YouTube
          className='YouTube-Player'
          videoId={this.state.currentVideo}
          opts={{ playerVars: { autoplay: 1 } }}
          onEnd={this.nextSong} 
          onReady={(e) => this.setVideoState(e)}/>
    }

    if (this.state.isHost) {
      toShow = content
    } else if (this.state.noVideos===true){
      toShow = content
    }else if (this.state.tuneInPlayer === true) {
      //TUNE IN PLAYER
      toShow = <YouTube
      className='YouTube-Player'
      videoId={this.state.currentVideo}
      opts={{ playerVars: { autoplay: 1, controls: 0 } }}
      onEnd={this.nextSong} 
      onReady={(e) => this.setTuneInVideoState(e)}/>
    }else {
      toShow = <div className='not-host-div'
        style={{ backgroundImage: `url(https://img.youtube.com/vi/${this.state.currentVideo}/0.jpg)` }}>

        <div className="white-box-thumb">
          <p className="white-box-thumb-text">Content will play on host device</p>
          <button onClick={this.tuneIn}>Tune In</button>
        </div>
      </div>
    }

    const { groupInfo } = this.state

    return (

      <div className='Playlist'>
        <div className="Playlist-Head">

          <div className="Playlist-Head-Text-Hold">
            <h1 className='Playlist-Head-Group-Name'>{groupInfo.name}</h1>
            <div className='white-line-head'></div>
            <h3 className='Playlist-Head-Joincode'>Join Code: {groupInfo.joincode}</h3>
          </div>
          <img className='Playlist-Head-Image' src={groupInfo.group_image} alt="" />
        </div>

        {toShow}

        {this.state.ready &&
          <List group_id={this.props.group_id}
            next={this.state.next}
            getPlaylist={this.getPlaylist}
            isHost={this.state.isHost}
            setPlaylist={this.setPlaylist} 
            favoritesong={this.state.favoritesong}
            song={this.state.song}
            tuneIn={this.state.tuneIn}
            videoState={this.state.videoState}
            tuneInPlayer={this.tuneInPlayer}
            currentVideo={this.state.currentVideo}/>
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