var passport = require('passport');

var TumblrController = function(app){
  return {
    start: function(req, res, next){
      passport.authenticate('tumblr');
    },

    callback: function(req, res){
      passport.authenticate('tumblr', {
        successRedirect: '/',
        failureRedirect: '/login'
      });
    }
  }
};

module.exports = TumblrController;