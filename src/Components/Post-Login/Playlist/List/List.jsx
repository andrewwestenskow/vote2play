import React, { Component } from 'react'
import axios from 'axios'
import Song from '../Song/Song'
import OldSong from '../OldSong/OldSong'
import ChatWindow from './ChatWindow/ChatWindow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import io from 'socket.io-client'
require('dotenv').config()
const { REACT_APP_YOUTUBE_API_KEY } = process.env

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playlist: [],
      newVideoUrl: '',
      prevPlayed: [],
      nowPlaying: [],
      chatMessages: [],
      ready: false,
      urlError: false,
      songAlready: false
    }
    this.socket = io.connect(':7777')
    this.socket.on('room response', data => {
      console.log('room response')
      this.updatePlaylist()
      this.props.getPlaylist()
    })

    this.socket.on('timecode request', data => {
      if (this.props.isHost === true && this.props.videoState !== undefined) {
        console.log(`request timecode: ${this.props.videoState.getCurrentTime(data)}`)
        this.broadcastTimecode(data)
      }
    })

    this.socket.on('timecode response', data => {
      if (this.props.login_id === data.requester) {
        console.log(`requester: ${data.requester} time: ${data.timecode}`)
        this.props.tuneInPlayer(data.timecode)
      }
    })

    this.socket.on('seek response', data => {
      if (this.props.tuneInState) {
        console.log(`Seek to ${data.timecode}`)
        this.props.tuneInVideoState.seekTo(data.timecode)
      }
    })

    this.socket.on('host pause', data => {
      if (this.props.tuneInState) {
        console.log(`Host paused`)
        this.props.tuneInVideoState.pauseVideo()
      }
    })

    this.socket.on('host play', data => {
      if (this.props.tuneInState) {
        console.log(`Host played`)
        this.props.tuneInVideoState.playVideo()
      }
    })

    this.socket.on('new message', data => {
      console.log(`hit`)
      this.setState({
        chatMessages: [...this.state.chatMessages, data]
      })
    })

  }

  //SOCKETS

  broadcast = () => {
    this.socket.emit('broadcast to group socket', {
      group_id: this.props.group_id
    })
  }

  broadcastGetTimeCode = () => {
    this.socket.emit('broadcast to get timecode', {
      group_id: this.props.group_id,
      login_id: this.props.login_id
    })
  }

  broadcastTimecode = (data) => {
    this.socket.emit('broadcast timecode', {
      group_id: this.props.group_id,
      timecode: this.props.videoState.getCurrentTime(),
      requester: data.login_id
    })
  }

  broadcastSeek = (timecode) => {
    this.socket.emit('broadcast seek', {
      group_id: this.props.group_id,
      timecode,
      host: this.props.login_id
    })
  }

  broadcastPause = () => {
    this.socket.emit('host pause', {
      group_id: this.props.group_id,
      host: this.props.login_id
    })
  }

  broadcastPlay = () => {
    this.socket.emit('host play', {
      group_id: this.props.group_id,
      host: this.props.login_id
    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  //CHAT METHODS

  handleChatSend = (message) => {
    this.socket.emit('message send', {
      name: message.name,
      message: message.message,
      image: message.image,
      group_id: this.props.group_id
    })
  }

  //LOCAL METHODS

  async componentWillMount() {
    await this.updatePlaylist()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.next !== this.props.next) {
      this.broadcast()
      this.updatePlaylist()
    }

    if (prevProps.song !== this.props.song) {
      this.addFavorite()
    }

    if (prevProps.tuneIn !== this.props.tuneIn) {
      this.tuneIn()
    }

    if (prevProps.pause !== this.props.pause) {
      this.broadcastPause()
    }

    if (prevProps.play !== this.props.play) {
      this.broadcastPlay()
    }
  }

  tuneIn = () => {
    this.broadcastGetTimeCode()
  }

  addFavorite = async () => {
    this.setState({
      newVideoUrl: this.props.favoritesong
    })

    let e = { preventDefault: () => { return } }

    setTimeout(() => {
      this.handleAddNewVideoFormSubmit(e)

    }, 10);
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

    let findPrev = await axios.post('/api/playlist/prev', { group_id })

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

    let nowPlaying = sortedArray.splice(0, 1)

    if (nowPlaying !== this.state.nowPlaying) {

      let nowPlayingVote = nowPlaying[0]

      if (nowPlayingVote) {
        await (axios.post('/api/playlist/vote', { playlistId: nowPlayingVote.group_playlist_id, vote: 9999 }))

        this.setState({
          nowPlaying: nowPlaying,
          playlist: sortedArray,
          prevPlayed: prevPlayed,
          ready: true
        })

      } else {
        this.setState({
          ready: false,
          prevPlayed: prevPlayed,
          nowPlaying: [],
        })
      }
    }

    this.socket.emit('join group', {
      group_id
    })

    if (this.state.nowPlaying[0]) {
      document.title = `Playing: ${this.state.nowPlaying[0].details.snippet.title}`
    } else {
      document.title = `vote 2 play`
    }

    this.props.setPlaylist(this.state.playlist)
  }

  handleNewVideoFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleAddNewVideoFormSubmit = async (e) => {
    e.preventDefault()
    this.setState({
      urlError: false,
      songAlready: false
    })
    const { group_id } = this.props
    let res = await axios.post('/api/playlist/addsong', { group_id: group_id, songUrl: this.state.newVideoUrl })
    // console.log(res.data)
    if (res.data === 'Song already on playlist') {
      this.setState({
        songAlready: true
      })
    }

    this.setState({
      newVideoUrl: ''
    })

    this.updatePlaylist()

    if (this.state.playlist.length === 0) {
      this.props.getPlaylist()
    }

    this.broadcast()
  }

  getPlaylistConditional = () => {
    if (this.state.nowPlaying.length === 0) {
      this.props.getPlaylist()
    }
  }



  render() {

    let playlist = this.state.playlist.filter(song => {
      if (song.details !== undefined) {
        return true
      } else {
        if (this.state.urlError === false) {
          this.setState({
            urlError: true
          })
        }
        axios.delete(`/api/playlist/${song.group_playlist_id}`)
        axios.delete(`/api/playlist/song/${song.song_id}`)
        return false
      }
    }).map(song => {
      return <Song key={song.group_playlist_id}
        data={song.details.snippet}
        playlistId={song.group_playlist_id}
        songId={song.song_id}
        score={song.score}
        updatePlaylist={this.updatePlaylist}
        title={song.details.snippet.localized.title}
        broadcast={this.broadcast}
        isHost={this.props.isHost}
        login_id={this.props.login_id}
      />
    })

    let previouslyPlayed = this.state.prevPlayed.map(song => {
      let { snippet } = song.details
      return <OldSong updatePlaylist={this.updatePlaylist}
        data={song}
        key={song.id}
        title={snippet.title}
        getPlaylistConditional={this.getPlaylistConditional}
        broadcast={this.broadcast}
        isHost={this.props.isHost} />
    })

    let nowPlaying = this.state.nowPlaying[0]

    let timestamps = []
    setInterval(() => {
      if (this.props.videoState && this.props.isHost) {
        const video = this.props.videoState
        let currentTime = video.getCurrentTime()
        let length = timestamps.length
        timestamps.push(currentTime)
        if (timestamps[length - 1] - timestamps[length - 2] > 2 || timestamps[length - 1] < timestamps[length - 2]) {
          this.broadcastSeek(currentTime)
        }
      }
    }, 1000);

    return (
      <div className='List'>
        {this.state.ready ?
          <div className='now-playing-hold'><h1>
            <span className="now-playing-text">
              NOW PLAYING:
          </span>

          </h1>
            <h1 className='now-playing-title'>{nowPlaying.details.snippet.title}</h1>
          </div> : <></>}
        <div className="white-line-playlist"></div>

        {this.state.ready ?
          <div className='playlist'>
            <div>
              <h1 className='now-playing-text'>UP NEXT:</h1>

              {playlist}

            </div>

            <div className="previous-chat-hold">
              <div className="previously-played">
                <div>
                  <h1 className='previously-played-text'>Previously Played: </h1>
                  {previouslyPlayed}
                </div>
                <form onSubmit={this.handleAddNewVideoFormSubmit} className='add-new-form'>
                  {this.state.songAlready && <p>Song is already on playlist</p>}
                  {this.state.urlError && <p>Error adding song, please try again</p>}
                  <input type="url"
                    name='newVideoUrl'
                    onChange={this.handleNewVideoFormChange}
                    value={this.state.newVideoUrl}
                    placeholder='Add new song'
                    className='add-song-input' />

                  <button className='add-song-button'>

                    <FontAwesomeIcon icon='plus-circle' />

                  </button>
                </form>
              </div>
              <ChatWindow
              image={this.props.image} 
              firstname={this.props.firstname}
              handleChatSend={this.handleChatSend}
              chatMessages={this.state.chatMessages}/>
            </div>
          </div> :

          <div className="previously-played">
            <div>
              <h1 className='previously-played-text'>Previously Played: </h1>
              {previouslyPlayed}
            </div>
            <form onSubmit={this.handleAddNewVideoFormSubmit} className='add-song-form'>
              {this.state.songAlready && <p>Song is already on playlist</p>}
              {this.state.urlError && <p>Error adding song, please try again</p>}
              <input type="url"
                name='newVideoUrl'
                onChange={this.handleNewVideoFormChange}
                value={this.state.newVideoUrl}
                placeholder='Add new song'
                className='add-song-input' />

              <button className='add-song-button'>

                <FontAwesomeIcon icon='plus-circle' />

              </button>
            </form>
            <ChatWindow
              image={this.props.image} 
              firstname={this.props.firstname}
              handleChatSend={this.handleChatSend}
              chatMessages={this.state.chatMessages}/>
          </div>}
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

export default connect(mapStateToProps)(List)