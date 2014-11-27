'use strict';

var mysql = require('mysql');

var db = {
  getConnection: function() {
    return mysql.createConnection({
      host: 'ホスト名',
      user: 'ユーザー',
      password: 'パスワード',
      database: 'DB名'
    });
  }
};

module.exports = db;
