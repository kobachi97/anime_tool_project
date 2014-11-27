"use strict";

var async = require('Async');
var twitter = require('twitter');
var favoriteModel = require('../model/favorite');
var twitterController = require('../controller/twitter');
var animeController = require('../controller/anime');
var _ = require('underscore');

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

var rankingData;
var profile;
var tweetList;

module.exports = {
  view: function(req, res) {

    async.series([
      function(done) {
        if (!req.session.twitter.user_id) {
          done('user_id is null');
        } else {
          twit.get('/users/show.json', {"user_id": req.session.twitter.user_id}, function (userData) {
            profile = userData;
            done(null);
          });
        }
      },
      function(done) {
        favoriteModel.selectRanking(function(err, result) {
          if (err) {
            done(err);
          } else {
            var rank = 1;
            _.each(result, function(val) {
              val.rank = rank;
              rank++;
            });
            rankingData = result;
            done(null);
          }
        });
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
        console.log('ERROR' + err);
        res.send('{"error": "RANKING VIEW ERROR"}');
      } else {
        res.render('ranking',{
          ranking: rankingData,
          profile: profile,
          tweetList: tweetList
        });
      }
    });
  }
};
