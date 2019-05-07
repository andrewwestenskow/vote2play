import React, { Component } from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Link} from 'react-router-dom'
import JoinGroup from '../JoinGroup/JoinGroup'

class Dashboard extends Component {

  state = {
    groups: []
  }

  componentDidMount(){
    axios.post('/api/group/getgroups', {login_id: this.props.login_id}).then(res => {
      this.setState({
        groups: res.data
      })
    })
  }

  updateGroups = () => {
    axios.post('/api/group/getgroups', {login_id: this.props.login_id}).then(res => {
      this.setState({
        groups: res.data
      })
    })
  }

  render() {

    let groups = this.state.groups.map(group => {
      return <Link to={`/group/${group.joincode}`}><div className='Group-Card' key={group.group_id}>
      <p>{group.name}</p>

      <img className='card-image' src={group.group_image} alt={group.name} onError={console.log(`Img error`)}/>

      <p>{group.joincode}</p>
      </div></Link>
    })
    return (
      <div className='Dashboard'>
        DASHBOARD
        <div className="cards-hold">
          {groups}
          <div className="Group-Card Join-Card">
            <JoinGroup login_id={this.props.login_id} updateGroups={this.updateGroups}/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const {login_id} = reduxState
  return {
    login_id
  }
}

export default connect(mapStateToProps)(Dashboard)