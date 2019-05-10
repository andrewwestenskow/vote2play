const bcrypt = require('bcryptjs')

module.exports = {

  register: async (req, res) => {
    const db = req.app.get('db')
    const {firstname, lastname, email, favoritesong, password} = req.body

    let users = await db.getUserByEmail(email)
    let user = users[0]

    if(user){
      return res.status(409).send(`Account with email already exists`)
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let response = await db.registerUser([firstname, lastname, email, favoritesong, hash])

    let login_id = response[0].user_login_id

    req.session.user = {
      isAuthenticated: true,
      login_id
    }

    res.status(200).send({isAuthenticated: true, login_id})
  },

  logIn: async (req, res) => {
    const db = req.app.get('db')
    const {email} = req.body

    let users = await db.getUserByEmail([email])
    let user = users [0]

    if(!user){
      return res.status(401).send(`Email or Password Incorrect`)
    }

    let isAuthenticated = bcrypt.compareSync(req.body.password, user.password)

    if(!isAuthenticated) {
      return res.status(401).send(`Email or Password Incorrect`)
    }

    const login_id = user.user_login_id

    req.session.user = {
      isAuthenticated,
      login_id
    }

    res.status(200).send({isAuthenticated, login_id})
  },

  getDetails: async (req, res) => {
    const db = req.app.get('db')
    try {
      const {login_id: id, isAuthenticated} = req.session.user
      let details = await db.getUserDetails({id})
      res.status(200).send({...details[0], login_id: id, isAuthenticated})
    } catch {
      res.sendStatus(500)
    }
    
  },

  logout: (req, res) => {
    req.session.destroy()

    res.sendStatus(200)
  }
}