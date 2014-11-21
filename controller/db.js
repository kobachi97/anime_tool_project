
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'test_user',
  password: 'test_password',
  database: '79school_db'
});

var db = {
  getConnection: function() {

  }
};

module.exports = db;
