'use strict';

var should = require('should');
var superAgent = require('superagent');

describe('@ranking', function() {

  var testUser = superAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364, 'screen_name': 'nekokonekonene'}).end(function (res) {
      done();
    });
  });

  it('/ get ranking view', function(done) {
    testUser.get('http://127.0.0.1:3000/ranking/view').end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });
});
