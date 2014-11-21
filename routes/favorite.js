'use strict';

var favoriteModel = require('../model/favorite');

module.exports = {
  favorite: function(req, res) {
    var data = new FavoriteObj(req.body.id, req.body.title);
    favoriteModel.insert(data, function(err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  }
};

var FavoriteObj = function(userId, title) {
  this.user_id = userId;
  this.title = title;
};
