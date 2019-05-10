module.exports = {
  getUserInfo: async (req, res) => {
    const db = req.app.get('db')

    try {
      const {login_id: id} = req.session.user
      let userInfo = await db.getUserDetails({id})
      res.status(200).send(userInfo)
    } catch (error) {
      res.sendStatus(500)
    }
  },

  updateInfo: async (req, res) => {
    const db = req.app.get('db')
    
    try {
      const {login_id} = req.session.user
      const {firstname, lastname, favoritesong, image} = req.body
      let updateInfos = await db.editUserDetails([login_id, firstname, lastname, favoritesong, image])
      let updateInfo = updateInfos[0]

      res.status(200).send(updateInfo)
      
    } catch (error) {
      res.sendStatus(500)
    }
  }
}