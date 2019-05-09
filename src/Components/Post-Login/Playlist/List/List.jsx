import React, { Component } from 'react'
import axios from 'axios'
import Song from '../Song/Song'
import OldSong from '../OldSong/OldSong'
import {connect} from 'react-redux'
require('dotenv').config()
const { REACT_APP_YOUTUBE_API_KEY } = process.env

class List extends Component {

  state = {
    playlist: [],
    newVideoUrl: '',
    prevPlayed: []
  }

  async componentWillMount() {
    await this.updatePlaylist()
    
  }

  componentDidUpdate(prevProps, prevState){
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

    let findPrev = await axios.post('/api/playlist/prev', {group_id})

    let prevPlayed = findPrev.data

    let videoIds1 = sortedArray.map(video => {
      return video.id
    })

    let videoIds2 = prevPlayed.map(video => {
      return video.id
    })

    let videoIds = [...videoIds1, ...videoIds2]


    let searchString = videoIds.join('%2C')

    let videoData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${searchString}&key=${REACT_APP_YOUTUBE_API_KEY}`)

    sortedArray.forEach(video => {
      let details = videoData.data.items.find(element => element.id === video.id)
      video.details = details
    })

    prevPlayed.forEach(video => {
      let details = videoData.data.items.find(element => element.id === video.id)
      video.details = details
    })

    this.setState({
      playlist: sortedArray,
      prevPlayed: prevPlayed
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

    if(this.state.playlist.length === 0){
      this.props.getPlaylist()
    }
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

    let previouslyPlayed = this.state.prevPlayed.map(song => {
      let {snippet} = song.details
      return <OldSong updatePlaylist={this.updatePlaylist} data={song} key={song.id} title={snippet.title}/>
    })

    return (
      <div>

        {playlist}

        <form onSubmit={this.handleAddNewVideoFormSubmit}>
          <input type="text" name='newVideoUrl'
            onChange={this.handleNewVideoFormChange} value={this.state.newVideoUrl} />
          <button>Add</button>
        </form>
      <h1>Previously Played</h1>
        <div>
          {previouslyPlayed}
        </div>
        
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