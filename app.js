var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var util = require('util');
var TumblrStrategy = require('passport-tumblr').Strategy;
var MongoStore = require('connect-mongo')(session);
var env = require('./env');

var app = express();
var app = module.exports = express();

// Passport session setup
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// Use the TumblrStrategy within Passport
passport.use(new TumblrStrategy({
    consumerKey: env.TUMBLR_CONSUMER_KEY,
    consumerSecret: env.TUMBLR_SECRET_KEY,
    callbackURL: "http://localhost:3000/auth/callback"
  },
  function(token, tokenSecret, profile, done) {
    // console.log(token, tokenSecret, profile);

    // tokenなどを格納
    // routes.jsで使用するために格納しておく
    app.set('token', token);
    app.set('tokenSecret', tokenSecret);
    console.log('token get');

    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// settings
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'app/views'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'violet_for_tumblr_secret',
  store: new MongoStore({
    db: 'session',
    host: 'localhost',
    clear_interval: 60 * 60 // 60 * 60 = 1 hour
  }),
  cookie: {
    httpOnly: false,
    maxAge: new Date(Date.now() + 60 * 60 * 1000) // 60 * 60 * 1000 = 3600000 msec = 1 hour
  },
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'app/assets')));

// routing
var routes = require('./app/routes/index');
var auth = require('./app/routes/auth');
var logout = require('./app/routes/logout');
app.use('/', routes);
app.use('/auth', auth);
app.use('/logout', logout);

// server
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});

// socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket){
  console.log('接続したぞ');

  socket.on('testEvent', function(data){
    console.log('testEventが起こったぞ');
    console.log(data);
  });
});