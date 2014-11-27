"use strict";

var express = require('express');
var path = require('path');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', require('ejs-locals'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
  {
    secret: 'secret',
    store: new redisStore({
      host: '127.0.0.1',
      port: 6379
    })
  }
));

var controller = {};
controller.main  = require('./controller/main.js');
controller.login  = require('./controller/login.js');
controller.twitter  = require('./controller/twitter.js');
controller.favorite  = require('./controller/favorite.js');
controller.ranking  = require('./controller/ranking.js');

require('./routes/index.js')(app, controller);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
