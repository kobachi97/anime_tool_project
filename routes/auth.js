"use strict";

//var express = require('express');
//var router = express.Router();

var SECRET = {
  CONSUMER_KEY: 'ALZueUJtsc4fj9YgdaC8z0bzY',
  CONSUMER_SECRET: 'q1fnoONCR6odtH0pNJH8i0DiRRHEBfw8spqGBgfodwdGFzHQ3V',
  ACCESS_TOKEN: '2904817364-URl0TshHjns4P5Q9smpzWbVhJNI3EFbHxrikS8a',
  ACCESS_TOKEN_SECRET: 'is6WmiCxkFQRg9hXzNzBAMy54ugKqVNlRqjiGpsQjwEPq'

};

var OAuth  = require('oauth').OAuth;
var oa = new OAuth(
  "https://twitter.com/oauth/request_token",
  "https://twitter.com/oauth/access_token",
  SECRET.CONSUMER_KEY,
  SECRET.CONSUMER_SECRET,
  "1.0",
  "http://127.0.0.1:3000/auth/callback",
  "HMAC-SHA1");

//router.get('/', function(req, res) {
//  console.log('ready');
//  oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
//    if (error) {
//      console.log('error');
//      console.log(results);
//      res.send("yeah no. didn't work.");
//    } else {
//      console.log('complete');
//      req.session.oauth = {};
//      req.session.oauth.token = oauth_token;
//      res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
//    }
//  });
//});

module.exports = {
  auth: function (req, res) {
    console.log('ready');
    oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
      if (error) {
        res.send("yeah no. didn't work.");
      } else {
        req.session.oauth = {};
        req.session.oauth.token = oauth_token;
        res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
      }
    });
  },
  callback: function (req, res) {
    console.log('callback');
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
    } else
      res.redirect('/login');
  },
  logout: function(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
};


