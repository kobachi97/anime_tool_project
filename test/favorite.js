'use strict';

var should = require('should');
var sperAgent = require('superagent');
var async = require('Async');
var app = require('../app.js');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

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

var twitter = {};


describe('@favorite', function() {

  var testUser = sperAgent.agent();
  before(function(done) {
//    testUser.get('http://127.0.0.1:3000/twitter/auth').end(function (res) {
//      console.log(res);
//      done();
//    });
    twitter = {};
    twitter.user_id = 2904817364;
    done();
  });
//  before(function(done) {
//      testUser.get('http://127.0.0.1:3000/twitter/auth').end(function(res) {
//
//          done();
//      });
//    console.log(app.get('sessionStore'));
//    async.series([
//      function(done) {
//        testUser.get('http://127.0.0.1:3000/twitter/auth').end(function() {
//          console.log('finish');
//          done();
//        });
//      },
//      function(done) {
//        testUser.get('http://127.0.0.1:3000/twitter/callback').end(function() {
//          console.log('finish');
//          done();
//        });
//      }
//    ], function() {
//      done();
//    });
//  });

  it('favorite/view', function(done) {
    testUser.get('http://127.0.0.1:3000/favorite/view').send({'user_id': 2904817364}).session({'twitter':twitter}).end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('favorite/register', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/register').send({'user_id': 2904817364, 'title':'カリメロ', 'time':'07:30', 'week':'火曜', 'station': 'テレビ東京'}).end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('favorite/register duplicated', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/register').send({'user_id': 2904817364, 'title':'カリメロ', 'time':'07:30', 'week':'火曜', 'station': 'テレビ東京'}).end(function(res) {
      should.equal(res.redirects.pop(), 'http://127.0.0.1:3000/error');
      done();
    });
  });

  it('favorite/delete', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/delete').send({'user_id': 2904817364, 'title':'カリメロ'}).end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('favorite/delete if not exist', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/delete').send({'user_id': 2904817364, 'title':'カリメロ'}).end(function(res) {
      should.equal(res.redirects.pop(), 'http://127.0.0.1:3000/error');
      done();
    });
  });
});
