/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tumblr = require('tumblr.js');
var async = require('async');

module.exports = {
  state: {},

  index: function(req, res) {
    // /dashboard読み込みの度にstateに初期値を保存
    this.state.data = [];
    this.state.pageNum = 1;
    this.state.limit = 3;
    this.state.articleCount = 0;
    this.state.articleTotal = 0;
    this.state.token = null;
    this.state.tokenSecret = null;
    this.state.isInitial = true;

    // ログインしてなかったらindexにリダイレクト
    if(!req.session.authenticated){
      return res.redirect('/');
    }
    // ログインしてたらdashboard表示
    else {
      // view表示
      res.view('./index');
      console.log('req.user: ', req.user);

      // stateにtokenとtokenSecretを格納
      this.state.token = req.user.token;
      this.state.tokenSecret = req.user.tokenSecret;
    }
  },

  // dashboard get request from client
  get: function(req, res){
    // tokenがなかったら処理を中止
    if(!this.state.token) {
      console.log('token or tokenSecretがないので処理中止したよ');
      return;
    }

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
    // ブラウザリロード時になぜか2回呼ばれてしまうので…
    // 1回目だけ処理をスキップ
    if(this.state.isInitial){
      console.log('1回目なので何もしないよ');
      return this.state.isInitial = false;
    }

    console.log('2回目以降なのでloadDb()を実行');

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
      offset: self.state.pageNum * self.state.limit - self.state.limit, // ページ番号 * 取得件数 - 取得件数
      format: 'html'
    };

    // ダッシュボードを取得
    client.dashboard(option, function(err, response){
      // 取得したデータを結合
      var oldData = self.state.data;
      var newData = oldData.concat(response.posts);

      // 結合したデータをstate.dataに格納
      self.state.data = newData;
      console.log('data: ', self.state.data);

      // 合計記事数をstate.articleTotalに入れる
      self.state.articleTotal = response.total_posts;

      // 値をアップデート
      self.state.pageNum += 1; //ページ番号を1つ増やす
      self.state.articleCount += self.state.limit; //取得記事合計をlimit(取得件数)分増やす
      console.log('pageNum after loadDb(): ', self.state.pageNum);
      console.log('articleCount after loadDb(): ', self.state.articleCount);

      return callback(null);
    });
  }
};