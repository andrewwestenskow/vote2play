function isAuthenticated(req, res, next) {
  if(req.session.user && req.session.user.isAuthenticated){
    return next()
  } else {
    res.status(403).send(`User is not logged in`)
  }
}

module.exports = {
  isAuthenticated
}