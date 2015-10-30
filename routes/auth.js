var app = require('../app.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');

var TumblrController = require('../controllers/tumblr.js')(app);

// /auth
router.get('/', passport.authenticate('tumblr'));

// /auth/callback
router.get('/callback', passport.authenticate('tumblr', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router;