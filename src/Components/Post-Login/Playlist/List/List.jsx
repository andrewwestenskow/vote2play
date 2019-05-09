import React, { Component } from 'react'
import axios from 'axios'
import Song from '../Song/Song'
import {connect} from 'react-redux'
require('dotenv').config()
const { REACT_APP_YOUTUBE_API_KEY } = process.env

class List extends Component {

  state = {
    playlist: [],
    newVideoUrl: '',
  }

  async componentWillMount() {
    await this.updatePlaylist()
    
  }

  componentDidUpdate(prevState, prevProps){
    if(prevProps.next !==this.props.next){
      this.updatePlaylist()
    }
  }

  
  

  updatePlaylist = async () => {
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

    let videoIds = sortedArray.map(video => {
      return video.id
    })
    let searchString = videoIds.join('%2C')

    let videoData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${searchString}&key=${REACT_APP_YOUTUBE_API_KEY}`)

    sortedArray.forEach(video => {
      let details = videoData.data.items.find(element => element.id === video.id)
      video.details = details
    })

    this.setState({
      playlist: sortedArray
    })
  }

  handleNewVideoFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleAddNewVideoFormSubmit = async (e) => {
    e.preventDefault()
    const { group_id } = this.props
    await axios.post('/api/playlist/addsong', { group_id: group_id, songUrl: this.state.newVideoUrl })

    this.setState({
      newVideoUrl: ''
    })

    this.updatePlaylist()
  }


  render() {

    let playlist = this.state.playlist.map(song => {
      return <Song key={song.group_playlist_id}
        playlistId={song.group_playlist_id}
        songId={song.song_id}
        score={song.score}
        updatePlaylist={this.updatePlaylist}
        title={song.details.snippet.localized.title}
      />
    })

    return (
      <div>

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
  return{
    group_id: reduxStore.group.group_id
  }
}

export default connect(mapStateToProps)(List)