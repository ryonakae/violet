var React = require('react');
var Router = require('react-router');
var routes = require('../client/javascripts/routes.jsx');
var tumblr = require('tumblr.js');
var env = require('../env.js');
var passport = require('passport');


module.exports = function(app){
  return {
    index: function(req, res, next){
      var content = '';
      var data = [];

      var router = Router.create({location: req.url, routes: routes});
      router.run(function(Handler, state) {
        console.log('react-router:run');
        content = React.renderToString(React.createElement(Handler, {
          routerState: state,
          environment: 'server'
        }), null);
      });

      function getDashboard(){
        var client = new tumblr.Client({
          consumer_key: env.TUMBLR_CONSUMER_KEY,
          consumer_secret: env.TUMBLR_SECRET_KEY,
          token: passport.session.token,
          token_secret: passport.session.tokenSecret
        });

        console.log('client: ', client);

        client.dashboard({limit:2}, function(err, response){
          console.log('ダッシュボードの情報取得できた');
          console.log('response: ', response);
          data.push(response);
        });
      }

      // usernameとtokenの両方がある時(ログインしてる時)の処理
      var loggedIn = false;
      if (req.session.passport.user && passport.session.token){
        loggedIn = true;
        console.log('ログインしてる(セッションに認証情報保存されてる)');
        getDashboard();
      }

      res.render('index', {
        title: 'Violet for Tumblr',
        user: req.user,
        content: content,
        loggedIn: loggedIn
      });
      console.log('indexレンダリング')
    }
  }
};