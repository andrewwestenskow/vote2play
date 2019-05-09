const express = require('express')
require('dotenv').config()
const app = express()
const massive = require('massive')
const session = require('express-session')
const UsersCtrl = require('./Controllers/UsersController')
const GroupCtrl = require('./Controllers/GroupController')
const AuthCtrl = require('./Controllers/AuthController')
const PlaylistCtrl = require('./Controllers/PlaylistController')
const authMiddleware = require('./Middlewares/authMiddleware')

const{SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env


//MIDDLEWARE
app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))



//AUTH ENDPOINTS
app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.logIn)
app.get('/auth/getdetails', authMiddleware.isAuthenticated,AuthCtrl.getDetails)
app.get('/auth/logout', AuthCtrl.logout)

//GROUP ENDPOINTS
app.post('/api/group/create', GroupCtrl.createGroup)
app.post('/api/group/getgroups', GroupCtrl.getGroups)
app.post('/api/group/join', GroupCtrl.joinGroup)
app.post('/api/group/checkhost', GroupCtrl.checkHost)
app.post('/api/group/getbyid', GroupCtrl.getGroupById)
app.post('/api/group/getbycode', GroupCtrl.getGroupByCode)

//PLAYLIST ENDPOINTS
app.post('/api/playlist/addsong', PlaylistCtrl.addToPlaylist)
app.post('/api/playlist', PlaylistCtrl.getPlaylist)
app.post('/api/playlist/vote', PlaylistCtrl.vote)
app.post('/api/playlist/reset', PlaylistCtrl.resetVote)
app.delete('/api/playlist/:playlistId', PlaylistCtrl.delete)
app.post('/api/playlist/prev', PlaylistCtrl.getPreviouslyPlayed)


//MASSIVE CONNECTION
massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log(`DB Set`)
  // console.log(`TABLES: ${db.listTables()}`)
  app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))
})
