function auth(req, res, next) {
  switch (true) {
    case req.session.user && req.session.user.loggedIn:
      next();
      break;
    default:
      res.status(401).send('Unauthorized');
  }
}

module.exports = auth;
