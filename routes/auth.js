var app = require('../app.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');

var TumblrController = require('../controllers/tumblr.js')(app, passport);

// /auth
router.get('/', TumblrController.start);

// /auth/callback
router.get('/callback', TumblrController.callback);

module.exports = router;