const express = require('express')
require('dotenv').config()
const app = express()
const massive = require('massive')
const session = require('express-session')
const socket = require('socket.io')
const aws = require('aws-sdk')
const UsersCtrl = require('./Controllers/UsersController')
const GroupCtrl = require('./Controllers/GroupController')
const AuthCtrl = require('./Controllers/AuthController')
const PlaylistCtrl = require('./Controllers/PlaylistController')
const authMiddleware = require('./Middlewares/authMiddleware')

const{SERVER_PORT, SESSION_SECRET, CONNECTION_STRING, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env


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
app.delete('/api/group/leave/:group_id', GroupCtrl.leaveGroup)

//PLAYLIST ENDPOINTS
app.post('/api/playlist/addsong', PlaylistCtrl.addToPlaylist)
app.post('/api/playlist', PlaylistCtrl.getPlaylist)
app.post('/api/playlist/vote', PlaylistCtrl.vote)
app.post('/api/playlist/reset', PlaylistCtrl.resetVote)
app.delete('/api/playlist/:playlistId', PlaylistCtrl.delete)
app.delete('/api/playlist/song/:song_id', PlaylistCtrl.deleteSong)
app.post('/api/playlist/prev', PlaylistCtrl.getPreviouslyPlayed)
app.delete('/api/playlist/prev/:previouslyPlayedId', PlaylistCtrl.deletePrev)
app.post('/api/playlist/addback', PlaylistCtrl.addBack)

//USERS ENDPOINTS
app.get('/api/users/info', UsersCtrl.getUserInfo)
app.put('/api/users/info', UsersCtrl.updateInfo)

// AWS S3 ENDPOINTS
app.get('/sign-s3', (req, res) => {

  aws.config = {
    region: 'us-west-1',
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
  
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };

    return res.send(returnData)
  });
});


//MASSIVE CONNECTION
massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log(`DB Set`)
  // console.log(`TABLES: ${db.listTables()}`)
})
