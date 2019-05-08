import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './Components/Home/Home'
import Sidebar from './Components/Post-Login/Sidebar/Sidebar'
import Dashboard from './Components/Post-Login/Dashboard/Dashboard'
import Profile from './Components/Post-Login/Profile/Profile'
import CreateGroup from './Components/Post-Login/CreateGroup/CreateGroup'
import JoinGroup from './Components/Post-Login/JoinGroup/JoinGroup'
import Playlist from './Components/Post-Login/Playlist/Playlist'

export default(
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route path='/:login_id' component={() => (
      <Sidebar>
        <Switch>
          <Route path ='/:login_id/dashboard' component={Dashboard}/>
          <Route path='/:login_id/profile' component={Profile}/>
          <Route path='/:login_id/creategroup' component={CreateGroup}/>
          <Route path='/:login_id/joingroup' component={JoinGroup}/>
          <Route path='/group/:joincode' component={Playlist}/>
        </Switch>
      </Sidebar>
    )}/>
  </Switch>
)