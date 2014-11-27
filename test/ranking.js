'use strict';

var should = require('should');
var superAgent = require('superagent');
var async = require('Async');

describe('@ranking', function() {

  var testUser = superAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364, 'screen_name': 'nekokonekonene'}).end(function (res) {
      done();
    });
  });

  it('/ranking/view get ranking view', function(done) {
    testUser.get('http://127.0.0.1:3000/ranking/view').end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('/ranking/view bad request user_id = null', function(done) {
    var invalidUser = superAgent.agent();

    async.series([
      function(done) {
        invalidUser.get('http://127.0.0.1:3000/test/login').send({'user_id': null}).end(function(res) {
          done();
        });
      },
      function(done){
        invalidUser.get('http://127.0.0.1:3000/ranking/view').end(function(res) {
          should.equal(JSON.parse(res.text).error, 'RANKING VIEW ERROR');
          done();
        });
      }
    ], function() {
      done();
    });
  });
});
