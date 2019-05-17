module.exports = {
  updateMessages: async (req, res) => {
    const db = req.app.get('db')

    try {
      const { group_id, messages } = req.body
      if(messages.length === 0) {
        return res.sendStatus(200)
      }
  
      let oldChat = await db.checkChat([group_id])
  
      if (oldChat.length === 0) {
        await db.createChat([group_id, messages])
      } else {
        await db.updateChat([group_id, messages])
      }
  
      res.sendStatus(200)
    } catch (error) {
      res.sendStatus(500)
    }
  },

  getChat: async (req, res) => {
    const db = req.app.get('db')
    const { group_id } = req.body

    try {
      let messages = await db.getChats([group_id])

      if (messages.length === 0) {
        res.sendStatus(200)
      } else {
        let message = messages[0]
        message.sendMessage = []
        message.messages.forEach(element => {
          message.sendMessage.push(JSON.parse(element))
        })
        res.status(200).send(message)
      }
    } catch (error) {
      res.sendStatus(500)
    }
  }
}