var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('passport');
var util = require('util');
var TumblrStrategy = require('passport-tumblr').Strategy;

var env = require('./env');
var TUMBLR_CONSUMER_KEY = env.TUMBLR_CONSUMER_KEY;
var TUMBLR_SECRET_KEY = env.TUMBLR_SECRET_KEY;

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the TumblrStrategy within Passport
passport.use(new TumblrStrategy({
    consumerKey: TUMBLR_CONSUMER_KEY,
    consumerSecret: TUMBLR_SECRET_KEY,
    callbackURL: "http://localhost:3000/auth/tumblr/callback"
  },
  function(token, tokenSecret, profile, done) {
    // console.log(token, tokenSecret, profile);

    // tokenなどを格納
    profile.token = token;
    profile.tokenSecret = tokenSecret;

    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var logout = require('./routes/logout');

var app = express();
var MongoStore = require('connect-mongo')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  store: new MongoStore({
    db: 'session',
    host: 'localhost',
    clear_interval: 60 * 60 // 60 * 60 = 1 hour
  }),
  cookie: {
    httpOnly: false,
    maxAge: new Date(Date.now() + 60 * 60 * 1000) // 60 * 60 * 1000 = 3600000 msec = 1 hour
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/logout', logout);

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
