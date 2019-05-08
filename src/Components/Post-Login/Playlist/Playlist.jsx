import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Song from './Song/Song'
const key = 'AIzaSyBWmS5GzvTWDsFooqmKLC18JQql8533-ME'

class Playlist extends Component {

  state = {
    playlist: [],
    isHost: false,
    groupInfo: {},
    newVideoUrl: ''
  }

  componentDidMount() {
    const { login_id, group_id } = this.props
    axios.post('/api/group/checkhost', { login_id, group_id }).then(res => {
      this.setState({
        isHost: res.data
      })
    })
    axios.post('/api/playlist', { group_id }).then(res => {
      this.setState({
        playlist: res.data
      })
    })
    axios.post('/api/group/getbyid', { group_id }).then(res => {
      this.setState({
        groupInfo: res.data
      })
    })
  }

  fetchVideo = (url) => {

  }

  handleNewVideoFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleAddNewVideoFormSubmit = async () => {
    const {group_id} = this.props
    await axios.post('/api/playlist/addsong', {group_id: group_id, songUrl: this.state.newVideoUrl})

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
    // var player
    // function onYouTubeIframeAPIReady() {
    //   player = new YT.Player('player', {
    //     height: '390',
    //     width: '640',
    //     videoId: 'M7lc1UVf-VE'
    //   })
    // }

    let playlist = this.state.playlist.map(song => {
      return <Song key={Math.random()} songId={song.song_id} songUrl={song.url} score={song.score} />
    })

    return (
      <div>
        {/* {onYouTubeIframeAPIReady()} */}
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

export default connect(mapStateToProps)(Playlist)