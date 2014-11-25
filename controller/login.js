'use strict';

module.exports = {
  login: function(req, res) {
    if (req.session.oauth && req.session.oauth.access_token) {
      res.redirect('/');
    } else {
      res.render('login', {title: 'ANIMAIL'});
    }
  }
};
