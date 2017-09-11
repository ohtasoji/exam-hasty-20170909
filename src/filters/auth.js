const UserSession = require('../models/user_session');
const User = require('../models/user');

module.exports = function (req, res, next) {
  let sessionId = req.signedCookies.session_id;
  if (sessionId === null || sessionId === undefined) {
    res.redirect('/login');
    return;
  }

  UserSession.find(sessionId).then(session => {
    return User.find(session.data.user_id);
  }).then(user => {
    res.locals.currentUser = user;
    next();
  }).catch(error => {
    console.error(error);
    res.redirect('/login');
  });
};
