var express = require('express');
var router = express.Router();
var tumblr = require('tumblr.js');

var React = require('react');
var Router = require('react-router');
var react_routes = require('../../client/javascripts/routes.jsx');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('now index');

  // routing
  var router = Router.create({location: req.url, routes: react_routes});
  var content = "";
  router.run(function(Handler, state) {
    console.log('react-router:run');
    content = React.renderToString(React.createElement(Handler));
  });

  // login check
  var loggedIn = false;
  if (req.user){
    loggedIn = true;
  }

  // render
  res.render('index', {
    title: 'Violet for Tumblr',
    user: req.user,
    content: content,
    loggedIn: loggedIn
  });
});

module.exports = router;
