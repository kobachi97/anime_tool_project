"use strict";

var express = require('express');
var router = express.Router();
var OAuth  = require('oauth').OAuth;
var request = require("request");
var async = require('Async');
var twitter = require('twitter');
var db = require('../controller/db');

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

var oa = new OAuth(
  "https://twitter.com/oauth/request_token",
  "https://twitter.com/oauth/access_token",
  SECRET.CONSUMER_KEY,
  SECRET.CONSUMER_SECRET,
  "1.0",
  "http://localhost.com:3000/auth/twitter/callback",
  "HMAC-SHA1");

var url = 'http://animemap.net/api/table/tokyo.json';
var data;
var tweetList;
var profile;


/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.oauth && req.session.oauth.access_token) {

    async.series([
      function(done) {
        request.get(url, function(err, res, body){
          if(err || res.statusCode !== 200) {
            console.log('ERROR!');
          } else {
            data = JSON.parse(body);
          }
        });
        done(null);
      },
      function(done) {

        done(null);
      },
//        ハッシュ検索
//      function(done) {
//        twit.get('/search/tweets.json', {"q":"#ごちうさ", "count": 10}, function(tweet) {
//          tweetList = tweet;
//        });
//        done(null);
//      },
      function(done) {
        console.log(req.session.twitter.user_id);
        twit.get('/users/show.json' , {"user_id":req.session.twitter.user_id}, function(userData) {
          profile = userData;
          console.log(profile);
        });
        done(null);
      },
      function(done){
        res.render('main', {
          title: 'main',
          profile: profile,
          data: data.response.item,
          tweetList: tweetList
        });
        done(null);
      }
    ]
  , function(err, results){
     console.log(err);
  });




  } else {
    res.redirect("/login");
  }

});


module.exports = router;
