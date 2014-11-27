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

var rankingData;
var profile;
var tweetList;

module.exports = {
  view: function(req, res) {
    if (req.session.oauth && req.session.oauth.access_token) {

      async.series([
        function(done) {
          twit.get('/users/show.json', {"user_id": req.session.twitter.user_id}, function (userData) {
            profile = userData;
            done(null);
          });
        },
        function(done) {
          if (!req.session.twitter.user_id) {
            done('user_id is null');
          } else {
            favoriteModel.selectRanking(function(err, result) {
              if (err) {
                done(err);
              } else {
                var rank = 1;
                console.log(result);

                _.each(result, function(val) {
                  val.rank = rank;
                  rank++;
                });
                rankingData = result;
                done(null);
              }
            });
          }
        },
        function(done) {
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
          res.send();
        } else {
          res.render('ranking',{
            ranking: rankingData,
            profile: profile,
            tweetList: tweetList
          });
        }
      });
    } else {
      res.redirect('/login');
    }
  }
};
