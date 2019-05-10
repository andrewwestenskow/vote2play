import React, {Component} from 'react'
import axios from 'axios'

class Profile extends Component{

  state = {
    userInfo: {},
    userGroups: [],
    loading: false,
    firstname: '',
    lastname:'',
    image: '',
    favoritesong:''
  }

  async componentDidMount(){
    let userInfo = await axios.get('/api/users/info')
    let userGroups = await axios.get('/api/group/getgroups')
    this.setState({
      userInfo: userInfo.data[0],
      userGroups: userGroups.data,
      loading: false
    })
  }

  render(){

    let groups = this.state.userGroups.map(group => {
      return <div key={group.group_id}>{group.name}</div>
    })

    let {userInfo} = this.state
    return(
      <div>Profile

        {!this.state.loading && 
        <div>
          <button>Edit info</button>
          <div>
            {userInfo.firstname}{userInfo.lastname}
            <img src={userInfo.image} alt={userInfo.firstname}/>
            {userInfo.favoritesong}
          </div>
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