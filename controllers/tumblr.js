var TumblrController = function(app, passport){
  return {
    start: function(req, res, next){
      passport.authenticate('tumblr');
    },

    callback: function(req, res, next){
      passport.authenticate('tumblr', {
        successRedirect: '/',
        failureRedirect: '/login'
      });
    }
  }
};

module.exports = TumblrController;