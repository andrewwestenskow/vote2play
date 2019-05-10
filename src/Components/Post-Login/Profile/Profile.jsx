import React, { Component } from 'react'
import axios from 'axios'
import EditForm from './EditForm/EditForm'

class Profile extends Component {

  state = {
    userGroups: [],
    loading: false,
    firstname: '',
    lastname: '',
    image: '',
    favoritesong: '',
    edit: false
  }

  async componentDidMount() {
    let userGroups = await axios.get('/api/group/getgroups')
    axios.get('/api/users/info').then(res => {
      let userInfo = res.data[0]
      this.setState({
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        favoritesong: userInfo.favoritesong,
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
  }

  render() {

    let groups = this.state.userGroups.map(group => {
      return <div key={group.group_id}>{group.name}</div>
    })

    let { firstname, lastname, favoritesong, image } = this.state
    return (
      <div>Profile

        {!this.state.loading &&
          <div>
            <button onClick={this.toggleEdit}>Edit info</button>
            <div>
              {firstname}{lastname}
              <img src={image} alt={firstname} />
              {favoritesong}
            </div>
            
            {this.state.edit && <EditForm editToggle={this.editToggle} sendForm={this.sendForm}
            userInfo={this.state}/>}

            <div>
              <h1>GROUPS:</h1>
              {groups}
            </div>
          </div>}
      </div>
    )
  }
}

export default Profile