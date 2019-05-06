import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './Components/Home/Home'
import Dashboard from './Components/Post-Login/Dashboard/Dashboard'

export default(
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route path='/:login_id/dashboard' component={Dashboard}/>
  </Switch>
)