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
    req.session.destroy();
    res.redirect('/');
  },

  // tumblr
  tumblr: function(req, res) {
    passport.authenticate('tumblr', { failureRedirect: '/login' }, function(err, user) {
      // エラー出た時
      if (err) {
        return res.serverError(err);
      }

      // ユーザーが存在しない時
      if (!user) {
        return res.redirect('/');
      }

      // 成功→ログインする
      req.logIn(user, function(err) {
        // エラー出た時
        if (err) {
          return res.serverError(err);
        }

        return res.redirect('/');
      });
    })(req, res);
  }
};

