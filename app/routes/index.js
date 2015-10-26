var express = require('express');
var router = express.Router();
var tumblr = require('tumblr.js');
var env = require('../env');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    var client = new tumblr.Client({
      consumer_key: env.TUMBLR_CONSUMER_KEY,
      consumer_secret: env.TUMBLR_SECRET_KEY,
      token: req.user.token,
      token_secret: req.user.tokenSecret
    });

    client.likes({ limit: 1 }, function(err, res){
      console.log(res);
    });
  }

  res.render('index', {
    title: 'Express',
    user: req.user
  });
});

module.exports = router;
