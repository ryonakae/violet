var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var React = require('react');
var Router = require('react-router');
var routes = require('./routes.jsx');

// view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// data sample
var superagent = require('superagent');
var jsonp = require('superagent-jsonp');
var data = [];
superagent
  .get('http://api.tumblr.com/v2/blog/dncngrl.com/posts')
  .use(jsonp)
  .query({
    api_key: 'hFUsxjtEHcCB9dylsCfDnVWQRpQrD5Bq1nWMRZJaz2LmHZU3tU',
    reblog_info: false,
    notes_info: false,
    format: 'html',
    type: 'text'
  })
  .end(function(err, res){
    data = res.body.response;
    console.log(data);
  });

// routing
app.use(function(req, res, next) {
  var router = Router.create({location: req.url, routes: routes});
  router.run(function(Handler, state) {
    console.log('Router:run');
    console.log(Handler);
    return res.render('index', {
      title: 'Violet for Tumblr',
      initialData: JSON.stringify(data),
      html: React.renderToString(React.createElement(Handler, {params: {data: data}}))
    });
  });
});

// server
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port, function(){
  console.log('Express server listening on port ' + port);
});