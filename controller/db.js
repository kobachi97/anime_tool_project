'use strict';

var mysql = require('mysql');

var db = {
  getConnection: function() {
    return mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: '79school_db'
    });
  }
};

module.exports = db;
