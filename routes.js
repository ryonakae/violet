module.exports = function(app){
  function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else {
      return console.log('Not authorized.');
    }
  };

  // controllers
  var IndexController = require('./controllers/index.js')(app);
  var TumblrController = require('./controllers/tumblr.js')(app);
  var LogoutController = require('./controllers/logout.js')(app);

  // routes
  app.get('/', IndexController.index);
  app.get('/auth', TumblrController.start);
  app.get('/auth/callback', TumblrController.callback);
  app.get('/logout', LogoutController.logout);
};