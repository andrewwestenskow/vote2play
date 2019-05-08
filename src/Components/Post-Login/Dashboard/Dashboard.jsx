import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { updateGroupId } from '../../../ducks/groupReducer'
import {updateLoginId} from '../../../ducks/userReducer'
import { Link } from 'react-router-dom'
import JoinGroup from '../JoinGroup/JoinGroup'

class Dashboard extends Component {

  state = {
    groups: []
  }

  async componentDidMount() {
    let userDetails = await axios.get('/auth/getdetails')
    const { firstname, login_id, isAuthenticated } = userDetails.data
    this.setState({
      firstname
    })
    this.props.updateLoginId({login_id, isAuthenticated})

    axios.post('/api/group/getgroups', { login_id: this.props.login_id }).then(res => {
      this.setState({
        groups: res.data
      })
    })
  }

  updateGroups = () => {
    axios.post('/api/group/getgroups', { login_id: this.props.login_id }).then(res => {
      this.setState({
        groups: res.data
      })
    })
  }

  render() {

    let groups = this.state.groups.map(group => {
      return <Link to={`/group/${group.joincode}`}
        key={group.joincode}
        onClick={() => this.props.updateGroupId(group.group_id)}>

        <div className='Group-Card' key={group.group_id}>
          <p>{group.name}</p>

          <img className='card-image' src={group.group_image} alt={group.name} />

          <p>{group.joincode}</p>
        </div>
      </Link>
    })
    return (
      <div className='Dashboard'>
        DASHBOARD
        <div className="cards-hold">
          {groups}
          <div className="Group-Card Join-Card">
            <JoinGroup login_id={this.props.login_id} updateGroups={this.updateGroups} />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const { login_id } = reduxState.users
  return {
    login_id
  }
}

export default connect(mapStateToProps, { updateGroupId, updateLoginId })(Dashboard)