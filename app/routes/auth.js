var express = require('express');
var router = express.Router();
var passport = require('passport');


// /auth/tumblr
router.get('/tumblr',
  passport.authenticate('tumblr'),
  function(req, res, next) {
    // console.dir(req, res, next);
  });

// /auth/tumblr/callback
router.get('/tumblr/callback',
  passport.authenticate('tumblr', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;