"use strict";

var twitter = require('twitter');
var favoriteModel = require('../model/favorite');
var animeController = require('../controller/anime');
var _ = require('underscore');
var async = require('Async');

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

var OAuth  = require('oauth').OAuth;
var oa = new OAuth(
  "https://twitter.com/oauth/request_token",
  "https://twitter.com/oauth/access_token",
  SECRET.CONSUMER_KEY,
  SECRET.CONSUMER_SECRET,
  "1.0",
  "http://127.0.0.1:3000/twitter/callback",
  "HMAC-SHA1");

module.exports = {
  auth: function (req, res) {
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret) {
      if (error) {
        res.send("yeah no. didn't work.");
      } else {
        req.session.oauth = {};
        req.session.oauth.token = oauth_token;
        req.session.oauth.token_secret = oauth_token_secret;
        res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
      }
    });
  },
  callback: function (req, res) {
    if (req.session.oauth) {
      req.session.oauth.verifier = req.query.oauth_verifier;
      var oauth = req.session.oauth;
      oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
        function (error, oauth_access_token, oauth_access_token_secret, results) {
          if (error) {
            res.send("yeah something broke.");
          } else {
            req.session.oauth.access_token = oauth_access_token;
            req.session.oauth.access_token_secret = oauth_access_token_secret;
            req.session.twitter = results;
            res.redirect("/");
          }
        }
      );
    } else {
      res.redirect('/login');
    }
  },
  logout: function(req, res) {
    req.session.destroy();
    res.redirect('/login');
  },
  post: function(req, res) {
    twit.updateStatus(req.body.tweet, function(err, data) {
      if(err.statusCode === 403) {
        var error = JSON.parse(err.data).errors;
        res.send('{"error": "' + error[0].message + '"}');
      } else {
        res.redirect('/');
      }
    });
  },
  reply: function(req, res) {

    async.waterfall([
      function (done) {
        animeController.getAll(function(err, anime) {
          var list = _.select(anime, function(val) {
            return val.today === '1';
          });
          done(null, list);
        });
      },
      function (animeData, done) {
        if (!req.session.twitter.user_id) {
          done('user_id is null');
        } else {
          favoriteModel.find(req.session.twitter.user_id, function (err, data) {
            if (err) {
              done(err);
            } else {
              var list = _.select(data, function (val) {
                return _.include(_.pluck(animeData, 'title'), val.title);
              });
              done(null, list);
            }
          });
        }
      }
    ], function (err, list) {
      if (err) {
        res.send('{"error": "SEND REPLY ERROR"}');
      } else {
        var tweet;

        if (list.length > 0) {
          tweet = '@' + req.session.twitter.screen_name + ' 今日は ';
          _.each(list, function (val) {
            tweet += '【' + val.title + '】 ';
          });
          tweet += 'の放送日です';
        } else {
          tweet = '本日放送のアニメはありません';
        }

        twit.updateStatus(tweet, function () {
          res.redirect('/favorite/view');
        });
      }
    });
  },
  testLogin: function(req, res) {
    req.session.twitter = {};
    req.session.twitter.user_id = req.body.user_id;
    req.session.twitter.screen_name = req.body.screen_name;
    res.redirect("/");
  },
  getTimeline: function(req, done) {
    twit.get('/statuses/user_timeline.json', {user_id: req.session.twitter.user_id, include_entities:true}, function(data) {
      done(null, data);
    });
  }
};


