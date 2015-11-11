var passport = require('passport');
var TumblrStrategy = require('passport-tumblr').Strategy;


var crypto = require('crypto');
var secretKey = 'some_random_secret';
var cipher = function(target){
  var cipher = crypto.createCipher('aes-256-cbc', secretKey);
  var crypted = cipher.update(target, 'utf-8', 'hex');
  return crypted += cipher.final('hex');
}


var validation = function(token, tokenSecret, profile, done){
  process.nextTick(function(){
    // usernameをDBから探して、見つかったら処理
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
          username: profile.username,
          token: cipher(token),
          tokenSecret: cipher(tokenSecret)
        };
        console.log('user profile: ', data);

        User.create(data, function(err, user){
          return done(err, user);
        });
      }
    });
  });
};


passport.serializeUser(function(user, done) {
  done(null, {
    username: user.username,
    token: user.token,
    tokenSecret: user.tokenSecret
  });
  // userがreq.session.passport.userに入る。他の場所から参照できる
  // ↑のdataのあれこれが入ってるオブジェクト
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


module.exports.http = {
  customMiddleware: function(app){
    passport.use(new TumblrStrategy({
      consumerKey: sails.config.TUMBLR_CONSUMER_KEY,
      consumerSecret: sails.config.TUMBLR_SECRET_KEY,
      // callbackURL: "http://localhost:1337/auth/tumblr/callback"
      callbackURL: (process.env.NODE_ENV === 'production') ? 'http://violet-rydg.rhcloud.com/auth/tumblr/callback' : 'http://localhost:1337/auth/tumblr/callback'
    }, validation));

    app.use(passport.initialize());
    app.use(passport.session());
  }
};