import React, {Component} from 'react'
import {ClipLoader} from 'react-spinners'
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class OldSong extends Component {

  state={
    loading: false,
    deleting: false
  }

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
    this.setState({
      loading:true
    })
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
      {!this.state.loading ? <button onClick={this.handleAddBack}
      className='old-song-button'>
      <FontAwesomeIcon icon='plus-circle'/>
      </button> : <div className="old-load-hold">
        <ClipLoader sizeUnit='em' size={1} color='#FFFFFF'/>
      </div>}

      {this.props.isHost && 

      <>
      {!this.state.deleting? <button onClick={this.handleDelete}
      className='old-song-button'>
      <FontAwesomeIcon icon='trash-alt'/>
      </button>: <div className="old-load-hold">
        <ClipLoader sizeUnit='em' size={1} color='#FFFFFF'/>
      </div>}
      </>}
      <h1 className="old-song-title">
        {this.props.title}
      </h1>
      </div>
    )
  }
}

export default OldSong