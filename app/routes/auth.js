var express = require('express');
var router = express.Router();
var passport = require('passport');

// /auth
router.get('/',
  passport.authenticate('tumblr'),
  function(req, res, next) {
    // console.dir(req, res, next);
    console.log('now /auth');
  });

// /auth/callback
router.get('/callback',
  passport.authenticate('tumblr', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('now /auth/callback');
    res.redirect('/');
  });

module.exports = router;