/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tumblr = require('tumblr.js');
var async = require('async');

module.exports = {
  state: {
    data: [],
    pageNum: 0,
    limit: 2,
    articleCount: 0,
    articleTotal: 0,
    token: null,
    tokenSecret: null,
    isInitial: true
  },

  index: function(req, res) {
    // ログインしてなかったらindexにリダイレクト
    if(!req.session.authenticated){
      return res.redirect('/');
    }
    // ログインしてたらdashboard表示
    else {
      res.view('./index');

      // stateにtokenとtokenSecretを格納
      this.state.token = req.user.token;
      this.state.tokenSecret = req.user.tokenSecret;

      // /dashboard読み込みの度に値をリセットする
      this.state.data = [];
      this.state.pageNum = 0;
      this.state.articleCount = 0;
      this.state.isInitial = true;
    }
  },

  // dashboard get request from client
  get: function(req, res){
    // // ブラウザリロード時になぜか2回呼ばれてしまうので…
    // // 1回目だけ処理をスキップ
    // if(this.state.isInitial){
    //   console.log('1回目なので何もしないよ');
    //   return this.state.isInitial = false;
    // }

    // async.waterfallで順番に処理を実行
    var self = this;
    async.waterfall([
      // 1つ増えたpageNumを使って、Tumblrのダッシュボードを取得する
      function(callback){
        self.loadDb(callback);
      },
      // 取得したデータを、res.send()とかres.json()でクライアントに送る
      function(callback){
        res.json(self.state.data);
        console.log('クライアントにデータ送ったよ');
        self.state.isInitial = false;
      }
    ]);
  },

  // ダッシュボード取得用関数
  loadDb: function(callback){
    console.log('loadDb()を実行');

    var self = this;

    // インスタンス作成
    var client = new tumblr.Client({
      consumer_key: sails.config.TUMBLR_CONSUMER_KEY,
      consumer_secret: sails.config.TUMBLR_SECRET_KEY,
      token: self.state.token,
      token_secret: self.state.tokenSecret
    });

    // オプション
    var option = {
      limit: self.state.limit,
      offset: self.state.pageNum * self.state.limit - self.state.limit,
      format: 'html'
    };

    // ダッシュボードを取得
    client.dashboard(option, function(err, response){
      // 取得したデータを結合
      var oldData = self.state.data;
      var newData = oldData.concat(response.posts);

      // 結合したデータをstate.dataに格納
      // 初回のみ重複分を削除
      if(self.state.isInitial){
        self.state.data = newData.splice(-self.state.limit, self.state.limit);
      } else {
        self.state.data = newData;
      }

      console.log('data: ', self.state.data);

      // 合計記事数をstate.articleTotalに入れる
      self.state.articleTotal = response.total_posts;

      // 値をアップデート
      // 初回のみアップデートしない(2回目以降はする)
      if(!self.state.isInitial){
        self.state.pageNum += 1;
        self.state.articleCount += self.state.limit;
      }
      console.log('pageNum after loadDb(): ', self.state.pageNum);
      console.log('articleCount after loadDb(): ', self.state.articleCount);

      callback(null);
    });
  }
};