const express = require('express')
require('dotenv').config()
const app = express()
const massive = require('massive')
const session = require('express-session')
const socket = require('socket.io')
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
const server = app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))
const io = socket(server)

io.on('connection', socket => {
  console.log(`Socket connected`)

  socket.on('disconnect', () => {
    console.log(`Socket disconnected`)
  })

  socket.on('broadcast to group socket', data => {
    console.log(`broadcast to room ${data.group_id}`)
    socket.to(data.group_id).broadcast.emit('room response', data)
  })


  //ROOM SOCKETS

  socket.on('join group', data => {
    console.log(`Join group ${data.group_id}`)
    socket.join(data.group_id)
  })
})



//AUTH ENDPOINTS
app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.logIn)
app.get('/auth/getdetails', authMiddleware.isAuthenticated,AuthCtrl.getDetails)
app.get('/auth/logout', AuthCtrl.logout)

//GROUP ENDPOINTS
app.post('/api/group/create', GroupCtrl.createGroup)
app.get('/api/group/getgroups', GroupCtrl.getGroups)
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
app.delete('/api/playlist/prev/:previouslyPlayedId', PlaylistCtrl.deletePrev)
app.post('/api/playlist/addback', PlaylistCtrl.addBack)

//USERS ENDPOINTS
app.get('/api/users/info', UsersCtrl.getUserInfo)
app.put('/api/users/info', UsersCtrl.updateInfo)


//MASSIVE CONNECTION
massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log(`DB Set`)
  // console.log(`TABLES: ${db.listTables()}`)
})
