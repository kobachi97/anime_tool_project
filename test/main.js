'use strict';

var should = require('should');
var sperAgent = require('superagent');
var request = require("request");


describe('@main', function() {

  var testUser = sperAgent.agent();

  it('getAnimeList!', function() {
    var url = 'http://animemap.net/api/table/tokyo.json';
    request.get(url, function(err, res, body){

      console.log('AAA');
      should.strictEqual(res.statusCode, 200);
    });
  });
});
