"use strict";

var express = require('express');
var router = express.Router();
var OAuth  = require('oauth').OAuth;

var SECRET = {
  CONSUMER_KEY: 'ALZueUJtsc4fj9YgdaC8z0bzY',
  CONSUMER_SECRET: 'q1fnoONCR6odtH0pNJH8i0DiRRHEBfw8spqGBgfodwdGFzHQ3V'
};

var oa = new OAuth(
  "https://twitter.com/oauth/request_token",
  "https://twitter.com/oauth/access_token",
  SECRET.CONSUMER_KEY,
  SECRET.CONSUMER_SECRET,
  "1.0",
  "http://localhost.com:3000/auth/twitter/callback",
  "HMAC-SHA1");


/* GET home page. */
router.get('/', function(req, res) {
  console.log(req.session.oauth);
  console.log(req.session.oauth.access_token);
  if(req.session.oauth && req.session.oauth.access_token) {
    res.render('main', {
      title: 'main'
    });
  } else {
    console.log('oauth2');
    res.redirect("/login");
  }

//  res.render('main', {
//    title: 'main',
//    screen_name: req.session.twitter.screen_name
//  });
});

module.exports = router;
