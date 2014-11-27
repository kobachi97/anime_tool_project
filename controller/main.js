"use strict";

var async = require('Async');
var twitter = require('twitter');
var favoriteModel = require('../model/favorite');
var twitterController = require('../controller/twitter');
var animeController = require('../controller/anime');
var _ = require('underscore');

var SECRET = {
  CONSUMER_KEY: 'ALZueUJtsc4fj9YgdaC8z0bzY',
  CONSUMER_SECRET: 'q1fnoONCR6odtH0pNJH8i0DiRRHEBfw8spqGBgfodwdGFzHQ3V',
  ACCESS_TOKEN: '2904817364-URl0TshHjns4P5Q9smpzWbVhJNI3EFbHxrikS8a',
  ACCESS_TOKEN_SECRET: 'is6WmiCxkFQRg9hXzNzBAMy54ugKqVNlRqjiGpsQjwEPq'
};

var twit = new twitter({
  consumer_key: SECRET.CONSUMER_KEY,
  consumer_secret: SECRET.CONSUMER_SECRET,
  access_token_key: SECRET.ACCESS_TOKEN,
  access_token_secret: SECRET.ACCESS_TOKEN_SECRET
});

var animeData;
var animeMap;
var profile;
var tweetList;

module.exports = {
  index: function(req, res) {
    if (req.session.oauth && req.session.oauth.access_token) {

      async.series([
        function (done) {
          animeController.getAll(function(err, data) {
            animeData = data;
            done(null);
          });
        },
        function (done) {
          twit.get('/users/show.json', {"user_id": req.session.twitter.user_id}, function (userData) {
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
        },
        function (done) {
          favoriteModel.find(req.session.twitter.user_id, function (err, result) {
            if (err) {
              done(err);
            }
            animeMap = _.each(animeData, function (item) {
              item.favorite = _.include(_.pluck(result, 'title'), item.title);
            });
            done(null);
          });
        }
      ], function (err) {
        if (err) {
          console.log(err);
        } else {
          res.render('main', {
            title: 'main',
            profile: profile,
            data: animeMap,
            tweetList: tweetList,
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  }
};
