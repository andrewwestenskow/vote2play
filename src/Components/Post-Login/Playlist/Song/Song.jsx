import React, {Component} from 'react'
import axios from 'axios'

class Song extends Component {


  handleUpvote = async () => {
    const {playlistId } = this.props
    await (axios.post('/api/playlist/vote', {playlistId, vote: 1}))
    this.props.updatePlaylist()
  }

  handleDownvote = async () => {
    const {playlistId} = this.props
    await (axios.post('/api/playlist/vote', {playlistId, vote: 0}))
    this.props.updatePlaylist()
  }

  render(){
    const {songUrl, score} = this.props

    return(
      <div>
        {songUrl}
        ||||||||||||||
        {score}
        <button onClick={this.handleUpvote}>up</button>
        <button onClick={this.handleDownvote}>down</button>
      </div>
    )
  }
}

export default Song