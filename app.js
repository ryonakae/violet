var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var util = require('util');
var TumblrStrategy = require('passport-tumblr').Strategy;
var MongoStore = require('connect-mongo')(session);
var env = require('./env');

var app = express();
var app = module.exports = express();

var model = require('./models/model.js');
var User = model.User;

// Passport session setup
passport.serializeUser(function(user, done) {
  console.log('user:', user.username);
  done(null, user.username);
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

    // tokenなどをセッションに格納
    passport.session.token = token;
    passport.session.tokenSecret = tokenSecret;
    console.log('tokenゲットしたぞ');
    console.log(passport.session);

    // ユーザ情報が MongoDB に保存されていなければモデルを作成して保存
    User.findOne({username:profile.username}, function(err, user){
      if(!user) {
        user = new User();
        user.username = profile.username;
        user.save(function(err){
          if (err) {
            return done(err);
          }
          console.log('MongoDBにユーザー名保存したぞ');
          done(null, user);
        });
      }
      console.log(user);
    });

    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var sessionStore = new MongoStore({
  db: 'session',
  host: 'localhost',
  clear_interval: 60 * 60 // 60 * 60 = 3600s = 1 hour
});

// settings
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  key: 'express.sid', //socket.io から参照する際にキーとして使ってるっぽい
  secret: 'session_secret',
  store: sessionStore,
  cookie: {
    httpOnly: false,
    maxAge: 60 * 60 * 1000 // 60 * 60 * 1000 = 3600000ms = 1 hour
  },
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'assets')));

// routing
var routes = require('./routes/index.js');
app.use('/', routes.home);
app.use('/auth', routes.auth);
app.use('/logout', routes.logout);

// server
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});


// socket.io
var io = require('socket.io').listen(server);
var passportSocketIo = require('passport.socketio');

io.set('authorization', passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'express.sid',
  secret: 'session_secret',
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

// セッションのAuthorize 成功
function onAuthorizeSuccess(data, accept){
  console.log('socket.ioのセッション認証が成功');
  accept(null, true);
}
//セッションのAuthorize 失敗
function onAuthorizeFail(data, message, error, accept){
  if(error) {
    throw new Error(message);
  }
  console.log('socket.ioのセッション認証が失敗:', message);
  accept(null, false);
}

io.sockets.on('connection', function(socket){
  console.log('Socket.ioで接続完了');

  // console.log(socket);
  var sid = socket.id;
  console.log('sid: '+sid);

  // var user = socket.request.user; //これでユーザーを参照できる

  socket.on('clickEvent', function(data){
    console.log('クライアントでボタンがクリックされた(のでサーバでなんか処理する)');

    io.sockets.to(sid).emit('testEvent', 'サーバでデータをなんか処理した(のでクライアントにデータ送る)');
  });
});