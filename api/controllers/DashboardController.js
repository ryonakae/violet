/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tumblr = require('tumblr.js');


function loadItems(pageNum) {
  var client = new tumblr.Client({
    consumer_key: sails.config.TUMBLR_CONSUMER_KEY,
    consumer_secret: sails.config.TUMBLR_SECRET_KEY,
    token: req.user.token,
    token_secret: req.user.tokenSecret
  });

  var option = {
    limit: 2,
    offset: 99
  };

  client.dashboard(option, function(err, response){
    data = data.concat(response.posts);
    return data;
  });
};


module.exports = {
  index: function(req, res) {
    // ログインしてなかったらindexにリダイレクト
    if(!req.session.authenticated){
      return res.redirect('/');
    }
    // ログインしてたらdashboard表示
    else {
      var data = [{authenticated: true}];

      res.view('./index', {
        user: req.user,
        initialData: JSON.stringify(data)
      });
      console.log('req.user: ', req.user);

      // /dashboard読み込みの度にpageNumを1にリセットする
      this.state.pageNum = 1;
      console.log('pageNum: ', this.state.pageNum);
    }
  },

  state: {
    pageNum: 1,
    data: []
  },

  // dashboard get
  get: function(req, res){
    // pageNumを1つ増やす
    this.state.pageNum += 1;
    console.log('pageNum: ', this.state.pageNum);

    // 1つ増えたpageNumを使って、Tumblrのダッシュボードを取得する
    // 取得したデータを、res.send()とかres.json()でクライアントに送る
    // res.json();
  }
};