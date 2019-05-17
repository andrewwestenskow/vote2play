import React, { Component } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Song extends Component {

  state = {
    hasUpvote: false,
    hasDownvote: false
  }


  handleUpvote = async () => {
    const { playlistId } = this.props

    if (!this.state.hasUpvote) {
      await (axios.post('/api/playlist/vote', { playlistId, vote: 1 }))
      this.setState({
        hasUpvote: true
      })
      this.props.updatePlaylist()
      this.props.broadcast()
    } else {
      await (axios.post('/api/playlist/vote', { playlistId, vote: 0 }))
      this.setState({
        hasUpvote: false
      })
      this.props.updatePlaylist()
      this.props.broadcast()
    }

  }

  handleDownvote = async () => {
    const { playlistId } = this.props

    if (!this.state.hasDownvote) {
      await (axios.post('/api/playlist/vote', { playlistId, vote: 0 }))
      this.setState({
        hasDownvote: true
      })
      this.props.updatePlaylist()
      this.props.broadcast()
    } else {
      await (axios.post('/api/playlist/vote', { playlistId, vote: 1 }))
      this.setState({
        hasDownvote: false
      })
      this.props.updatePlaylist()
      this.props.broadcast()
    }
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
        <img className='thumbnail' src={this.props.data.thumbnails.default.url} alt={title} />

        <div className="song-text-hold">
          <h1 className="song-title-text">
            {title}
          </h1>
          <div className="score-button-hold">
            <span className="score-text">
              Score: {score}
            </span>

            <button onClick={this.handleUpvote}
              className='vote-button'>

              {this.state.hasUpvote ?
                <FontAwesomeIcon
                  icon='hand-point-up'
                  className='vote-done' /> :
                <FontAwesomeIcon
                  icon='hand-point-up'
                  className='vote-undone' />}

            </button>

            <button onClick={this.handleDownvote}
              className='vote-button'>

              {this.state.hasDownvote ?
                <FontAwesomeIcon
                  icon='hand-point-down'
                  className='vote-done' /> :
                <FontAwesomeIcon
                  icon='hand-point-down'
                  className='vote-undone' />}

            </button>

            {this.props.isHost &&
              <button onClick={this.handleDelete}
                className='vote-button'>

                <FontAwesomeIcon
                  icon='trash-alt'
                  className='vote-undone' />

              </button>}
          </div>
        </div>
      </div>
    )
  }
}

export default Song