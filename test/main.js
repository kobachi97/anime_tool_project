'use strict';

var should = require('should');
var sperAgent = require('superagent');

describe('@main', function() {

  var testUser = sperAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364}).end(function (res) {
      done();
    });
  });

  it('get main view!', function() {
    testUser.get('http://127.0.0.1:3000/').end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });
});
