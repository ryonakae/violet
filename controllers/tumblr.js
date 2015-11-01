var passport = require('passport');

module.exports = function(app){
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