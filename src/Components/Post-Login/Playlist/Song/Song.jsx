import React, { Component } from 'react'
import axios from 'axios'

class Song extends Component {

  state = {
    hasUpvote: false,
    hasDownvote: false
  }


  handleUpvote = async () => {
    const { playlistId } = this.props
    await (axios.post('/api/playlist/vote', { playlistId, vote: 1 }))
    this.setState({
      hasUpvote: true
    })
    this.props.updatePlaylist()
    this.props.broadcast()
  }

  handleDownvote = async () => {
    const { playlistId } = this.props
    await (axios.post('/api/playlist/vote', { playlistId, vote: 0 }))
    this.setState({
      hasDownvote: true
    })
    this.props.updatePlaylist()
    this.props.broadcast()
  }

  handleDelete = async () => {
    const { playlistId } = this.props
    await (axios.delete(`/api/playlist/${playlistId}`))
    this.props.updatePlaylist()
    this.props.broadcast()
  }

  render() {
    const { score, title } = this.props

    return (
      <div className='Song'>
        <img src={this.props.data.thumbnails.default.url} alt={title} />

        <div className="song-text-hold">
          <h1 className="song-title-text">
            {title}
          </h1>
          <div className="score-button-hold">
            Score: {score}

            <button onClick={this.handleUpvote}
              disabled={this.state.hasUpvote}>up</button>

            <button onClick={this.handleDownvote}
              disabled={this.state.hasDownvote}>down</button>

            {this.props.isHost && <button onClick={this.handleDelete}>Delete</button>}
          </div>
        </div>
      </div>
    )
  }
}

export default Song