module.exports ={
  addToPlaylist: async (req, res) => {
    const db = req.app.get('db')
    const {group_id, songUrl: url} = req.body

    let songId

    try {
      let checkSong = await db.checkSong([url])
      if (checkSong.length === 0) {
        songId = await db.addSong([url])
      } else {
        songId = checkSong
      }

      await db.addToPlaylist([group_id, songId[0].song_id])

      let playlist = await db.getPlaylist([group_id])

      res.status(200).send(playlist)
      
    } catch (error) {
      res.status(500).send(`Could not add song`)
    }


  },

  getPlaylist: async (req, res) => {
    const db = req.app.get('db')
    const {group_id} = req.body
    try {
      let playlist = await db.getPlaylist([group_id])
      res.status(200).send(playlist)
    } catch (error) {
      res.sendStatus(500)
    }

  }
}