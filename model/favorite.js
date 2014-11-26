'use strict';

var db = require('../controller/db');
var dt = Math.round(new Date().getTime() / 1000);

var model = {
  findAll: function() {
    db.getConnection().query('SELECT * FROM FAVORITE;', function(err, data, callback) {
      if(err) {
        console.log(err);
      } else {
        return callback(null, data);
      }
    });
  },
  find: function(userId, callback) {
    var query = 'SELECT * FROM favorite WHERE user_id = ' + userId + ';';
    db.getConnection().query(query, function(err, data) {
      if(err) {
        console.log('FIND ' + err);
      } else {
        return callback(null, data);
      }
    });
  },
  insert: function(obj, callback) {
    var query = 'INSERT FAVORITE SET ' +
      'user_id = ?, ' +
      'title = ?, ' +
      'time = ?, ' +
      'week = ?, ' +
      'station = ?, ' +
      'createdAt = ?, ' +
      'updatedAt = ?;';
    var params = [
      obj.user_id,
      obj.title,
      obj.time,
      obj.week,
      obj.station,
      dt,
      dt
    ];
    db.getConnection().query(query, params, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback(null);
      }
    });
  },
  update: function(obj, callback) {

    var query = 'UPDATE FAVORITE SET ' +
      'user_id = ?, ' +
      'title = ?;' +
      'updatedAt = ?, ' +
      'WHERE user_id = ? & ' +
      'title = ?;';
    var params = [
      obj.user_id,
      obj.title,
      dt,
      obj.user_id,
      obj.title
    ];
    db.getConnection().query(query, params, function(err) {
      if (err) {
        return callback(err);
      }
    });
  },
  remove: function(obj, callback) {
    var query = 'DELETE FROM favorite WHERE user_id = ' + obj.user_id + ' AND title = "' + obj.title + '";';
    db.getConnection().query(query, function(err) {
      if(err) {
        console.log('DELETE ' + err);
        return callback(err);
      } else {
        return callback(null);
      }
    });
  }
};


module.exports = model;
