var passport = require('passport');
var TumblrStrategy = require('passport-tumblr').Strategy;
var env = require('../env.js');


var validation = function(token, tokenSecret, profile, done){
  process.nextTick(function(){
    console.log(profile);

    // ユーザー名をDBから探して、見つかったら処理
    User.findOne({username:profile.username}, function(err, user){
      // ユーザーがDBに存在する場合
      if(user){
        return done(null, user);
      }
      // ユーザーがDBに存在しない場合
      // 新しくDBにユーザー情報を登録
      else {
        var data = {
          provider: profile.provider,
          username: profile.username
        };

        User.create(data, function(err, user){
          return done(err, user);
        });
      }
    });
  });
};


passport.serializeUser(function(user, done) {
  done(null, user.username);
  // usernameがreq.session.passport.userに入る。他の場所から参照できる
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


module.exports.http = {
  customMiddleware: function(app){
    passport.use(new TumblrStrategy({
      consumerKey: env.TUMBLR_CONSUMER_KEY,
      consumerSecret: env.TUMBLR_SECRET_KEY,
      callbackURL: "http://localhost:1337/auth/tumblr/callback"
    }, validation));

    app.use(passport.initialize());
    app.use(passport.session());
  }
};