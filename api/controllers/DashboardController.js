/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tumblr = require('tumblr.js');
var data = [];


function loadItems(req, res, callback) {
  var client = new tumblr.Client({
    consumer_key: sails.config.TUMBLR_CONSUMER_KEY,
    consumer_secret: sails.config.TUMBLR_SECRET_KEY,
    token: req.user.token,
    token_secret: req.user.tokenSecret
  });

  client.dashboard({limit:2}, function(err, response){
    data = data.concat(response.posts);
    callback(data);
    return data;
    // console.log('data: ', data);
    // console.log('ダッシュボードを取得してdataに格納');
  });
};


module.exports = {
  index: function(req, res) {
    // ブラウザリロードの度に配列の中身増えていくので、書き方変える
    loadItems(req, res, function(data){
      res.view({
        title: 'Violet for Tumblr',
        user: req.user,
        data: JSON.stringify(data)
      });
      console.log('req.user: ', req.user);
      console.log('data: ', data);
    });
  }
};