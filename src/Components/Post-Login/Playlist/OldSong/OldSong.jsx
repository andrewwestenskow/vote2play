import React, {Component} from 'react'
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class OldSong extends Component {

  handleDelete = async () => {
    const {previously_played_id} = this.props.data
    try {
      await axios.delete(`/api/playlist/prev/${previously_played_id}`)
      this.props.updatePlaylist()
      this.props.broadcast()
    } catch (error) {
      console.log(error)
    }
  }

  handleAddBack = async () => {
    const {previously_played_id, group_id, song_id} = this.props.data

    try {
      await axios.post('/api/playlist/addback', {previously_played_id, group_id, song_id})

      this.props.updatePlaylist()
      this.props.getPlaylistConditional()
      this.props.broadcast()
    } catch (error) {
      console.log(error)
    }

  }

  render(){
    return(
      <div className='Old-Song'>
      <button onClick={this.handleAddBack}
      className='old-song-button'>
      <FontAwesomeIcon icon='plus-circle'/>
      </button>

      {this.props.isHost && 

      <button onClick={this.handleDelete}
      className='old-song-button'>
      <FontAwesomeIcon icon='trash-alt'/>
      </button>}
      <h1 className="old-song-title">
        {this.props.title}
      </h1>
      </div>
    )
  }
}

export default OldSong