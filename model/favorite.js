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
    var query = 'SELECT * FROM FAVORITE WHERE user_id =' + userId + ';';
    db.getConnection().query(query, function(err, data) {
      if(err) {
        console.log(err);
      } else {
        return callback(null, data);
      }
    });
  },
  insert: function(obj, callback) {
    console.log('obj' + obj.user_id);
    console.log('obj' + obj.title);
    var query = 'INSERT FAVORITE SET ' +
      'user_id = ?, ' +
      'title = ?, ' +
      'createdAt = ?, ' +
      'updatedAt = ?;';
    var params = [
      obj.user_id,
      obj.title,
      dt,
      dt
    ];
    db.getConnection().query(query, params, function(err) {
      if (err) {
        return callback(err);
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
  }
};


module.exports = model;
