var passport = require('passport');
var TumblrStrategy = require('passport-tumblr').Strategy;


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
          token: sails.config.crypt.encrypt(token),
          tokenSecret: sails.config.crypt.encrypt(tokenSecret)
        };
        // console.log('user profile: ', data);

        User.create(data, function(err, user){
          console.log('New User Added!: ', user);
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
      callbackURL: (process.env.NODE_ENV === 'production') ? 'https://violet-for-tumblr.herokuapp.com/auth/tumblr/callback' : 'http://localhost:1337/auth/tumblr/callback'
    }, validation));

    app.use(passport.initialize());
    app.use(passport.session());
  }
};