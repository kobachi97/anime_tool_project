"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var OAuth  = require('oauth').OAuth;
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var twitter = require('./routes/twitter');
var favorite = require('./routes/favorite');

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

app.use('/', routes.main);
app.use('/users', routes.users);
app.use('/login', routes.login);
app.use('/auth/twitter', twitter.auth);
app.use('/auth/callback', twitter.callback);
app.use('/auth/logout', twitter.logout);
app.use('/post', twitter.post);
app.use('/favorite', favorite.favorite);

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
