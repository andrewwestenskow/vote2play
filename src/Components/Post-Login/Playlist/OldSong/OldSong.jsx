import React, {Component} from 'react'
import axios from 'axios'

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
      <div>
      {this.props.title}
      <button onClick={this.handleAddBack}>Add Again</button>
      <button onClick={this.handleDelete}>Delete</button>
      </div>
    )
  }
}

export default OldSong