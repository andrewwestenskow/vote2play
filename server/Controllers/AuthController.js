const bcrypt = require('bcryptjs')

module.exports = {

  register: async (req, res) => {
    const db = req.app.get('db')
    const {firstname, lastname, email, favoritesong, image, password} = req.body

    let users = await db.getUserByEmail(email)
    let user = users[0]

    if(user){
      console.log(user)
      return res.status(409).send(`Account with email already exists`)
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let response = await db.registerUser(firstname, lastname, email, favoritesong, image, hash)

    let loggedIn = response[0]

    req.session.user = loggedIn

    res.status(200).send(loggedIn)
  }
}