/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {
  // logout
  logout: function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  },

  // tumblr
  tumblr: function(req, res) {
    passport.authenticate('tumblr', { failureRedirect: '/' }, function(err, user) {
      // エラー出た時
      if (err) {
        return sails.log.error(err);
      }

      // ユーザーが存在しない時
      else if (!user) {
        return res.redirect('/');
      }

      // 成功→ログインする
      // その前にセッション再生成
      req.session.regenerate(function(err){
        req.session.passport = {};
        req._passport.session = req.session.passport;

        if (err) {
          return sails.log.error(err);
        }

        req.logIn(user, function(err) {
          if (err) {
            return sails.log.error(err);
          }

          req.session.authenticated = true; // for sessionAuth.js
          return res.redirect('/dashboard');
        });
      });
    })(req, res);
  },

  // is authenticated
  isAuth: function(req, res){
    var isAuth;

    if(req.session.authenticated){
      isAuth = true;
    } else {
      isAuth = false;
    }

    res.json({
      isAuth: isAuth
    });
  }
};

