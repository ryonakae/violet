var express = require('express');
var router = express.Router();
var tumblr = require('tumblr.js');
var env = require('../../env');

var React = require('react');
var Router = require('react-router');
var react_routes = require('../../client/javascripts/routes.jsx');

var app = module.parent.exports;

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('now index');
  var data = '';

  // routing
  var router = Router.create({location: req.url, routes: react_routes});
  var content = "";
  router.run(function(Handler, state) {
    console.log('react-router:run');
    content = React.renderToString(React.createElement(Handler));
  });

  // get dashboard function
  var getDashboard = function(){
    var client = new tumblr.Client({
      consumer_key: env.TUMBLR_CONSUMER_KEY,
      consumer_secret: env.TUMBLR_SECRET_KEY,
      token: app.set('token'),
      token_secret: app.set('tokenSecret')
    });

    console.log(client);

    console.log('consumer_key: ' + client.credentials.consumer_key);
    console.log('consumer_secret: ' + client.credentials.consumer_secret);
    console.log('token: ' + client.credentials.token);
    console.log('token_secret: ' + client.credentials.token_secret);

    client.dashboard(function(err, response){
      console.log(response);
      data = response;
    });
  }

  // login check
  var loggedIn = false;
  if (req.user){
    loggedIn = true;
    // getDashboard();
    console.log('ログインしてる…はず！');
  }

  // render
  res.render('index', {
    title: 'Violet for Tumblr',
    user: req.user,
    content: content,
    loggedIn: loggedIn,
    data: data
  });
});

module.exports = router;
