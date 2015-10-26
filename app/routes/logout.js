var express = require('express');
var router = express.Router();


// /logout
router.get('/', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;