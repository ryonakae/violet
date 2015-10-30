var React = require('react');
var Router = require('react-router');
var routes = require('../client/javascripts/routes.jsx');


var IndexController = function(app){
  return {
    index: function(req, res, next){
      var content = '';

      var router = Router.create({location: req.url, routes: routes});
      router.run(function(Handler, state) {
        console.log('react-router:run');
        content = React.renderToString(React.createElement(Handler, {
          routerState: state,
          environment: 'server'
        }), null);
      });

      var loggedIn = false;
      if (req.user){
        loggedIn = true;
        console.log('ログインしてる(tokenがある)');
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

module.exports = IndexController;