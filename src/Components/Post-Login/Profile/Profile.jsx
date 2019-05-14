import React, { Component } from 'react'
import axios from 'axios'
import EditForm from './EditForm/EditForm'
import YouTube from 'react-youtube'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class Profile extends Component {

  state = {
    userGroups: [],
    loading: false,
    firstname: '',
    lastname: '',
    image: '',
    favoritesong: '',
    edit: false,
  }

  async componentDidMount() {
    let userGroups = await axios.get('/api/group/getgroups')
    axios.get('/api/users/info').then(res => {
      let userInfo = res.data[0]

      function YouTubeGetID(url) {
        var ID = '';
        url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if (url[2] !== undefined) {
          //eslint-disable-next-line
          ID = url[2].split(/[^0-9a-z_\-]/i);
          ID = ID[0];
        }
        else {
          ID = url;
        }
        return ID;
      }

      let faveSong = YouTubeGetID(userInfo.favoritesong)

      this.setState({
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        favoritesong: userInfo.favoritesong,
        favoritesongid: faveSong,
        image: userInfo.image,
      })
    })
    this.setState({
      userGroups: userGroups.data,
      loading: false
    })
  }

  toggleEdit = (e) => {
    e.preventDefault()
    this.setState({
      edit: !this.state.edit
    })
  }

  sendForm = (body) => {
    axios.put('/api/users/info', body).then(res => {
      // console.log(res.data)
      let newInfo = res.data
      this.setState({
        firstname: newInfo.firstname,
        lastname: newInfo.lastname,
        favoritesong: newInfo.favoritesong,
        image: newInfo.image
      })
    })
    window.location.reload()
  }

  leaveGroup = async (group_id) => {

    console.log(group_id)
    await axios.delete(`/api/group/leave/${group_id}`)
    window.location.reload()
  }



  render() {

    let groups = this.state.userGroups.map(group => {
      return <div key={group.group_id} className='profile-group-card'>
        <img className='Group-Image' src={group.group_image} alt={group.name} />

        <div className="button-text-hold">
          <h1 className="group-card-name">
            {group.name}
          </h1>
          <button className='leave-button' onClick={() => this.leaveGroup(group.group_id)}>Leave Group
        <FontAwesomeIcon className='leave-icon' icon='sign-out-alt' />
          </button></div>
      </div>
    })

    let { firstname, lastname, image } = this.state


    return (
      <div className='Profile'>

        <div className="Profile-Head">

          <div className="Profile-Head-Text-Hold">
            <h1 className='Profile-Head-Group-Name'>{`${firstname} ${lastname}`}</h1>
            <div className='white-line-head'></div>
            <button onClick={this.toggleEdit}>Edit info</button>
          </div>
          <img className='Profile-Image'
            src={image} alt="Profile" />
        </div>

        <div className="video-group-hold">
          <div className='groups-hold'>
            <h1 className='header-text'>GROUPS:</h1>
            {groups}
          </div>

          <div className="song-form-hold">
            <div className='favorite-song-hold'>
              <h1 className='header-text'>Favorite Song: </h1>
              <YouTube className='favorite-video' videoId={this.state.favoritesongid} />
            </div>

            {this.state.edit &&
              <EditForm editToggle={this.editToggle} sendForm={this.sendForm}
                userInfo={this.state} />}
          </div>


        </div>
      </div>
    )
  }
}

export default Profile