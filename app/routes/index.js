var express = require('express');
var router = express.Router();
var tumblr = require('tumblr.js');
var env = require('../env');

/* GET home page. */
router.get('/', function(req, res, next) {
  var User;

  if (req.user) {
    User = req.user;

    var client = new tumblr.Client({
      consumer_key: env.TUMBLR_CONSUMER_KEY,
      consumer_secret: env.TUMBLR_SECRET_KEY,
      token: User.token,
      token_secret: User.tokenSecret
    });

    client.likes({ limit: 1, offset: 100 }, function(err, response){
      console.log(response);
    });
  }

  res.render('index', {
    title: 'Violet for Tumblr',
    user: User
  });
});

module.exports = router;
