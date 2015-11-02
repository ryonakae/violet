/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
  // login
  index: function(req, res) {
    res.view();
  },

  // logout
  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },

  // tumblr
  twitter: function(req, res) {
    passport.authenticate('tumblr', { failureRedirect: '/login' }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        res.redirect('/');
        return;
      });
    })(req, res);
  }
};

