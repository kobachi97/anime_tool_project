'use strict';

var should = require('should');
var sperAgent = require('superagent');

describe('@twitter', function() {

  var testUser = sperAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364}).end(function (res) {
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

  it('twitter/reply success', function(done) {
    testUser.post('http://127.0.0.1:3000/twitter/post').end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

});
