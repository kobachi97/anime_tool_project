'use strict';

var request = require("request");
var _ = require('underscore');

var url = 'http://animemap.net/api/table/tokyo.json';

var animeMap = {
  getAll: function(callback) {
    request.get(url, function(err, res, body){
      if(err || res.statusCode !== 200) {
        console.log('ERROR!');
        callback(err);
      } else {
        callback(null, JSON.parse(body).response.item);
      }
    });
  }
};

module.exports = animeMap;
