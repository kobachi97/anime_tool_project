'use strict';

var should = require('should');
var superAgent = require('superagent');
var async = require('Async');

describe('@twitter', function() {
  this.timeout(10000);

  var testUser = superAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364, 'screen_name': 'nekokonekonene'}).end(function (res) {
      done();
    });
  });

  it('twitter/post success', function(done) {
    var tweet = 'test';
    testUser.post('http://127.0.0.1:3000/twitter/post').send({'tweet': tweet}).end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('twitter/post tweet is null', function(done) {
    var tweet = null;
    testUser.post('http://127.0.0.1:3000/twitter/post').send({'tweet': tweet}).end(function(res) {
      should.equal(JSON.parse(res.text).error, 'TWEET SEND ERROR');
      done();
    });
  });

  it('twitter/post over 140 characters', function(done) {
    var tweet = 'ああああああああああああああああああああああああああああああああああああ' +
                'ああああああああああああああああああああああああああああああああああああ' +
                'ああああああああああああああああああああああああああああああああああああ' +
                'ああああああああああああああああああああああああああああああああああああ';

    testUser.post('http://127.0.0.1:3000/twitter/post').send({'tweet': tweet}).end(function(res) {
      should.equal(JSON.parse(res.text).error, 'TWEET SEND ERROR');
      done();
    });
  });

  it('favorite/reply success', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/reply').end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('favorite/reply bad request user_id = null', function(done) {
    var invalidUser = superAgent.agent();

    async.series([
      function(done) {
        invalidUser.get('http://127.0.0.1:3000/test/login').send({'user_id': null}).end(function(res) {
          done();
        });
      },
      function(done){
        invalidUser.post('http://127.0.0.1:3000/favorite/reply').end(function(res) {
          should.equal(JSON.parse(res.text).error, 'SEND REPLY ERROR');
          done();
        });
      }
    ], function() {
      done();
    });
  });

});
