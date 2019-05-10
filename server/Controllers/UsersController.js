module.exports = {
  getUserInfo: async (req, res) => {
    const db = req.app.get('db')

    try {
      const {login_id: id} = req.session.user
      console.log(id)
      let userInfo = await db.getUserDetails({id})
      console.log(userInfo)
      res.status(200).send(userInfo)
    } catch (error) {
      res.sendStatus(500)
    }
  }
}