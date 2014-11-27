'use strict';

var favoriteModel = require('../model/favorite');
var async = require('Async');
var twitter = require('twitter');
var twitterController = require('../controller/twitter');

var SECRET = {
  CONSUMER_KEY: 'your consumer key',
  CONSUMER_SECRET: 'your consumer secret key',
  ACCESS_TOKEN: '2904817364-URl0TshHjns4P5Q9smpzWbVhJNI3EFbHxrikS8a',
  ACCESS_TOKEN_SECRET: 'is6WmiCxkFQRg9hXzNzBAMy54ugKqVNlRqjiGpsQjwEPq'
};

var twit = new twitter({
  consumer_key: SECRET.CONSUMER_KEY,
  consumer_secret: SECRET.CONSUMER_SECRET,
  access_token_key: SECRET.ACCESS_TOKEN,
  access_token_secret: SECRET.ACCESS_TOKEN_SECRET
});


var favoriteList;
var profile;
var tweetList;

module.exports = {
  register: function(req, res) {
    var data = new FavoriteObj(req.body.user_id, req.body.title, req.body.time, req.body.week, req.body.station);
    favoriteModel.insert(data, function(err) {
      if (err) {
        res.send('{"error": "INSERT ERROR"}');
      } else {
        res.redirect("/");
      }
    });
  },
  view: function(req, res) {

    async.series([
      function(done) {
        favoriteModel.find(req.session.twitter.user_id, function(err, data) {
          if (err) {
            res.send('{"error": "FIND ERROR"}');
          } else {
            favoriteList = data;
            done();
          }
        });
      },
      function(done) {
        twit.get('/users/show.json' , {"user_id":req.session.twitter.user_id}, function(userData) {
          profile = userData;
          done(null);
        });
      },
      function (done) {
        twitterController.getTimeline(req, function(err, result) {
          if (err){
            done(err);
          } else {
            tweetList = result;
            done(null);
          }
        });
      }
    ], function(err) {
      if (err) {
        res.send('{"error": "FAVORITE VIEW ERROR"}');
      } else {
        res.render('favorite', {
          data: favoriteList,
          profile: profile,
          tweetList: tweetList
        });
      }
    });
  },
  remove: function(req, res) {
    var data = new FavoriteObj(req.body.user_id, req.body.title, null, null, null);
    favoriteModel.remove(data, function(err) {
      if (err) {
        res.send('{"error": "DELETE ERROR"}');
      } else {
        res.redirect("/favorite/view");
      }
    });
  }
};

var FavoriteObj = function(userId, title, time, week, station) {
  this.user_id = userId;
  this.title = title;
  this.time = time;
  this.week = week;
  this.station = station;
};
