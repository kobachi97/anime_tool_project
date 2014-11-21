"use strict";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.oauth && req.session.oauth.access_token) {
  } else {
    res.render('login', {title: 'ANIMAIL'});
  }
});

module.exports = router;
