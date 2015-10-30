var app = require('../app.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');

var TumblrController = require('../controllers/tumblr.js')(app, passport);

// /auth
router.get('/', TumblrController.start, function(req, res, next) {
  console.log('now: /auth');
});

// /auth/callback
router.get('/callback', TumblrController.callback, function(req, res) {
  console.log('now: /auth/callback');
  res.redirect('/');
});

module.exports = router;