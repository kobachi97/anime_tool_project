'use strict';

var should = require('should');
var superAgent = require('superagent');

describe('@login', function() {

  var testUser = superAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364, 'screen_name': 'nekokonekonene'}).end(function (res) {
      done();
    });
  });

  it('/login ', function(done) {
    testUser.get('http://127.0.0.1:3000/').end(function(res) {
      should.equal(res.redirects.pop(), 'http://127.0.0.1:3000/login');
      done();
    });
  });
});
