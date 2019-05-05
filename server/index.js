const express = require('express')
require('dotenv').config()
const app = express()
const massive = require('massive')
const session = require('express-session')
const UsersCtrl = require('./Controllers/UsersController')
const GroupCtrl = require('./Controllers/GroupController')
const AuthCtrl = require('./Controllers/AuthController')
const PlaylistCtrl = require('./Controllers/PlaylistController')

const{SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))

app.post('/auth/register', AuthCtrl.register)

massive(CONNECTION_STRING).then(db => {
  app.set('db', db)
  console.log(`DB Set`)
  // console.log(`TABLES: ${db.listTables()}`)
  app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`))
})
