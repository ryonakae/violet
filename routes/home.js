var app = require('../app.js');
var express = require('express');
var router = express.Router();

var IndexController = require('../controllers/index.js')(app);

router.get('/', IndexController.index);

module.exports = router;

// var tumblr = require('tumblr.js');
// var env = require('../env');

// var React = require('react');
// var Router = require('react-router');
// var react_routes = require('../client/javascripts/routes.jsx');

// var app = module.parent.exports;

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   console.log('indexを表示した');
//   var data = '';
//   // data = [
//   //   { id: 1, name: 'backbone' },
//   //   { id: 2, name: 'react' },
//   //   { id: 3, name: 'angular' },
//   // ];

//   // get dashboard function
//   var getDashboard = function(){
//     var client = new tumblr.Client({
//       consumer_key: env.TUMBLR_CONSUMER_KEY,
//       consumer_secret: env.TUMBLR_SECRET_KEY,
//       token: app.set('token'),
//       token_secret: app.set('tokenSecret')
//     });

//     console.log(client);

//     client.dashboard({limit:2}, function(err, response){
//       console.log(response.posts);
//       console.log('ダッシュボードの情報取得できた');
//       data = response.posts;
//     });
//   }

//   // login check
//   var loggedIn = false;
//   if (app.set('token')){
//     loggedIn = true;
//     getDashboard();
//     console.log('ログインしてる(tokenがある)');
//   }

//   // react router run
//   var router = Router.create({location: req.url, routes: react_routes});
//   var content = "";
//   router.run(function(Handler, state) {
//     console.log('react-router:run');
//     content = React.renderToString(React.createElement(Handler));
//   });

//   // render
//   res.render('index', {
//     title: 'Violet for Tumblr',
//     user: req.user,
//     content: content,
//     loggedIn: loggedIn,
//     initialData: JSON.stringify(data)
//   });
// });

// module.exports = router;
