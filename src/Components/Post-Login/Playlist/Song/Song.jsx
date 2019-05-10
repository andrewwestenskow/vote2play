import React, {Component} from 'react'
import axios from 'axios'

class Song extends Component {


  handleUpvote = async () => {
    const {playlistId } = this.props
    await (axios.post('/api/playlist/vote', {playlistId, vote: 1}))
    this.props.updatePlaylist()
    this.props.broadcast()
  }

  handleDownvote = async () => {
    const {playlistId} = this.props
    await (axios.post('/api/playlist/vote', {playlistId, vote: 0}))
    this.props.updatePlaylist()
    this.props.broadcast()
  }

  handleDelete = async ()=> {
    const {playlistId} = this.props
    await (axios.delete(`/api/playlist/${playlistId}`))
    this.props.updatePlaylist()
    this.props.broadcast()
  }

  render(){
    const {score, id, title} = this.props   

    return(
      <div>
        {title}
        {id}
        Score: {score}
        <button onClick={this.handleUpvote}>up</button>
        <button onClick={this.handleDownvote}>down</button>

        {this.props.isHost && <button onClick={this.handleDelete}>Delete</button>}
      </div>
    )
  }
}

export default Song