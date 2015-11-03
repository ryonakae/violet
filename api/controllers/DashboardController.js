/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tumblr = require('tumblr.js');


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
    console.log('ダッシュボードを取得してdataに格納');
  });
};


module.exports = {
  index: function(req, res) {
    res.view({
      title: 'Violet for Tumblr',
      user: req.user,
      // data: JSON.stringify(data)
    });
    console.log('req.user: ', req.user);
  },

  hello: function(req, res){
    sails.sockets.join(req.socket, 'fromServer');
    res.json({message:'fromSwerver message'});
  }
};