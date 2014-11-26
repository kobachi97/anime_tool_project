'use strict';

var should = require('should');
var superAgent = require('superagent');

describe('@favorite', function() {

  var testUser = superAgent.agent();
  before(function(done) {
    testUser.get('http://127.0.0.1:3000/test/login').send({'user_id': 2904817364, 'screen_name': 'nekokonekonene'}).end(function (res) {
      done();
    });
  });

  it('favorite/view success', function(done) {
    testUser.get('http://127.0.0.1:3000/favorite/view').end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('favorite/register success', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/register').send({'user_id': 2904817364, 'title':'カリメロ', 'time':'07:30', 'week':'火曜', 'station': 'テレビ東京'}).end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

  it('favorite/register duplicated', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/register').send({'user_id': 2904817364, 'title':'カリメロ', 'time':'07:30', 'week':'火曜', 'station': 'テレビ東京'}).end(function(res) {
      should.equal(JSON.parse(res.text).error, 'INSERT ERROR');
      done();
    });
  });

  it('favorite/register bad request user_id is null', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/register').send({'user_id': null, 'title':'カリメロ', 'time':'07:30', 'week':'火曜', 'station': 'テレビ東京'}).end(function(res) {
      should.equal(JSON.parse(res.text).error, 'INSERT ERROR');
      done();
    });
  });

  it('favorite/register bad request title is null', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/register').send({'user_id': 2904817364, 'title': null, 'time':'07:30', 'week':'火曜', 'station': 'テレビ東京'}).end(function(res) {
      should.equal(JSON.parse(res.text).error, 'INSERT ERROR');
      done();
    });
  });

  it('favorite/delete success', function(done) {
    testUser.post('http://127.0.0.1:3000/favorite/delete').send({'user_id': 2904817364, 'title':'カリメロ'}).end(function(res) {
      should.equal(res.statusCode, 200);
      done();
    });
  });

});
