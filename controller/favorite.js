'use strict';

var favoriteModel = require('../model/favorite');
var async = require('Async');
var twitter = require('twitter');

var SECRET = {
  CONSUMER_KEY: 'ALZueUJtsc4fj9YgdaC8z0bzY',
  CONSUMER_SECRET: 'q1fnoONCR6odtH0pNJH8i0DiRRHEBfw8spqGBgfodwdGFzHQ3V',
  ACCESS_TOKEN: '2904817364-URl0TshHjns4P5Q9smpzWbVhJNI3EFbHxrikS8a',
  ACCESS_TOKEN_SECRET: 'is6WmiCxkFQRg9hXzNzBAMy54ugKqVNlRqjiGpsQjwEPq'
};

var twit = new twitter({
  consumer_key: SECRET.CONSUMER_KEY,
  consumer_secret: SECRET.CONSUMER_SECRET,
  access_token_key: SECRET.ACCESS_TOKEN,
  access_token_secret: SECRET.ACCESS_TOKEN_SECRET
});


var favoriteList;
var profile;

module.exports = {
  register: function(req, res) {
    var data = new FavoriteObj(req.body.id, req.body.title, req.body.time, req.body.week, req.body.station);
    favoriteModel.insert(data, function(err) {
      if (err) {
        console.log('INSERT ERROR ' + err);
      }
    });
    res.redirect("/");
  },
  view: function(req, res) {

    async.series([
      function(done) {
        favoriteModel.find(req.session.twitter.user_id, function(err, data) {
          if (err) {
            console.log('FIND ERROR+ ' + err);
          } else {
            favoriteList = data;
            done();
          }
        });
      },
      function(done) {
        twit.get('/users/show.json' , {"user_id":req.session.twitter.user_id}, function(userData) {
          profile = userData;
          done(null);
        });
      }
    ], function(err) {
      if (err) {
        console.log('FAVORITE VIEW ERROR' + err);
        res.redirect('/');
      } else {
        res.render('favorite', {
          data: favoriteList,
          profile: profile
        });
      }
    });
  },
  remove: function(req, res) {
    var data = new FavoriteObj(req.body.id, req.body.title);
    favoriteModel.remove(data, function(err) {
      if (err) {
        console.log('DELETE ERROR ' + err);
      }
    });
    res.redirect("/favorite/view");
  }
};

var FavoriteObj = function(userId, title, time, week, station) {
  this.user_id = userId;
  this.title = title;
  this.time = time;
  this.week = week;
  this.station = station;
};
