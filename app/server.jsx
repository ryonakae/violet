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
var app = express();
var MongoStore = require('connect-mongo')(session);

var React = require('react');
var Router = require('react-router');
var routes = require('./routes.jsx');

var env = require('./env');
var TUMBLR_CONSUMER_KEY = env.TUMBLR_CONSUMER_KEY;
var TUMBLR_SECRET_KEY = env.TUMBLR_SECRET_KEY;
var TUMBLR_API_KEY = env.TUMBLR_API_KEY;

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

// data sample
var superagent = require('superagent');
var jsonp = require('superagent-jsonp');
var data = [];
superagent
  .get('http://api.tumblr.com/v2/blog/dncngrl.com/posts')
  .use(jsonp)
  .query({
    api_key: TUMBLR_API_KEY,
    reblog_info: false,
    notes_info: false,
    format: 'html',
    type: 'text'
  })
  .end(function(err, res){
    data = res.body.response;
    // console.log(data);
  });

// settings
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
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
  },
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// routing
app.use(function(req, res, next) {
  var router = Router.create({location: req.url, routes: routes});
  router.run(function(Handler, state) {
    console.log('Router:run');
    // console.log(Handler);
    return res.render('index', {
      title: 'Violet for Tumblr',
      initialData: JSON.stringify(data),
      html: React.renderToString(React.createElement(Handler, {params: {data: data}}))
    });
  });
});

// server
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});