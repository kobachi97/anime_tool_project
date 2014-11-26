'use strict';

var should = require('should');
var sperAgent = require('superagent');
//var session = require('express-session');
//var app = express();
//var session = require('express-session');

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
  "http://127.0.0.1:3000/twitter/callback",
  "HMAC-SHA1");


describe('@twitter', function() {

  var testUser = sperAgent.agent();

  it('twitter/auth', function(done) {
    oa.getOAuthRequestToken(function (error, oauth_token) {
      if (error) {
        res.send("yeah no. didn't work.");
      } else {
        req.session.oauth = {};
        req.session.oauth.token = oauth_token;
        res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token);
      }
    });
  });
});
