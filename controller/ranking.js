"use strict";

var async = require('Async');
var twitter = require('twitter');
var favoriteModel = require('../model/favorite');
var twitterController = require('../controller/twitter');
var animeController = require('../controller/anime');
var _ = require('underscore');

var rankingData;

module.exports = {
  view: function(req, res) {
    if (req.session.oauth && req.session.oauth.access_token) {

      async.series([
        function(done) {
          if (!req.session.twitter.user_id) {
            done('user_id is null');
          } else {
            favoriteModel.selectRanking(function(err, result) {
              if (err) {
                done(err);
              } else {
                console.log(result);
                rankingData = result;
                done(null);
              }
            });
          }
        }
      ], function(err) {
        if (err) {
          res.send();
        } else {
          res.render('ranking',{
            ranking: rankingData
          });
        }
      });
    } else {
      res.redirect('/login');
    }
  }
};
