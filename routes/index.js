'use strict';

var routes = function(app, controller) {
  app.get('/', controller.main.index);
  app.get('/login', controller.login.login);
  app.get('/twitter/auth', controller.twitter.auth);
  app.get('/twitter/callback', controller.twitter.callback);
  app.get('/twitter/logout', controller.twitter.logout);
  app.post('/twitter/post', controller.twitter.post);
  app.post('/favorite/register', controller.favorite.register);
  app.get('/favorite/view', controller.favorite.view);
  app.post('/favorite/delete', controller.favorite.remove);
  app.post('/favorite/reply', controller.twitter.reply);
  app.get('/test/login', controller.twitter.testLogin);
  app.get('/ranking/view', controller.ranking.view);
};

module.exports = routes;
