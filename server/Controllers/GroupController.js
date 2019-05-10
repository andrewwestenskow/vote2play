module.exports = {
  createGroup: async (req, res) => {
    const db = req.app.get('db')
    const { name, require_admin_join, require_admin_song, login_id, group_image } = req.body

    try {
      function randomString() {
        let string = Math.random().toString(36).replace('0.', '').toUpperCase().split('')
        string.splice(5, Infinity)
        return string.join('')
      }

      let joincode = randomString()

      let result = await db.createGroup([name, joincode, require_admin_join, require_admin_song, group_image])

      await db.joinGroup([result[0].group_id, login_id, true])
      return res.status(200).send(result[0])

    } catch (err) {
      return res.status(409).send(`Join code conflict`)
    }
  },

  joinGroup: async (req, res) => {
    const db = req.app.get('db')
    const { joincode, login_id } = req.body

    try {
      let existingGroups = await db.groupCheck(login_id)

      let check = existingGroups.filter(group => {
        return group.joincode === joincode
      })

      if(check.length !== 0) {
        return res.status(409).send(`User already in group`)
      }
      
      let group_id = await db.getGroupByCode([joincode])


      if(group_id.length === 0){
        return res.status(500).send('Incorrect group code')
      }

      let result = await db.joinGroup([group_id[0].group_id, login_id, false])

      res.status(200).send(result[0])

    } catch (err) {
      return res.sendStatus(500)
    }
  },

  getGroups: async (req, res) => {
    const db = req.app.get('db')
    try {
      const { login_id } = req.session.user
      let groups = await db.getGroups(login_id)
      res.status(200).send(groups)
    } catch (error) {
      res.redirect('/')
    }
  },

  checkHost: async (req, res) => {
    const db = req.app.get('db')
    const {login_id, group_id} = req.body

    try {
      let isHost = await db.checkHost([login_id, group_id])
      res.status(200).send(isHost[0].ishost)
    } catch (error) {
      res.status(500).send(`User is not in group`)
    }
  },

  getGroupById: async (req, res) => {
    const db = req.app.get('db')

    try {
      let groupInfo = await db.getGroupById([req.body.group_id])
      res.status(200).send(groupInfo[0])
    } catch (error) {
      res.sendStatus(500)
    }
  },

  getGroupByCode: async (req, res) => {
    const db = req.app.get('db')

    try {
      let groupInfo = await db.getGroupByCode([req.body.joincode])
      res.status(200).send(groupInfo[0])
    } catch (error) {
      res.sendStatus(500)
    }
  },

  leaveGroup: async (req, res) => {
    const db = req.app.get('db')
    const{group_id} = req.params
    const{login_id} = req.session.user

    await db.leaveGroup([login_id, +group_id])

    res.sendStatus(200)
  }
}