/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var tumblr = require('tumblr.js');
var async = require('async');


var crypto = require('crypto');
var secretKey = 'some_random_secret';
var decipher = function(target){
  decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  var decrypted = decipher.update(target, 'hex', 'utf-8');
  return decrypted += decipher.final('utf-8');
}


module.exports = {
  state: {},


  index: function(req, res) {
    // /dashboard読み込みの度にstateに初期値を保存
    this.state.data = [];
    this.state.pageNum = 1;
    this.state.limit = 20;
    this.state.articleCount = 0;
    this.state.articleTotal = 0;
    this.state.username = null;
    this.state.token = null;
    this.state.tokenSecret = null;
    this.state.isInitial = true;
    this.state.sinceId = 0;

    // ログインしてなかったらindexにリダイレクト
    if(!req.session.authenticated){
      return res.redirect('/');
    }
    // ログインしてたらdashboard表示
    else {
      // view表示
      res.view('./index');
      console.log('req.user: ', req.user);

      // stateに値を格納
      this.state.username = req.user.username;
      this.state.token = req.user.token;
      this.state.tokenSecret = req.user.tokenSecret;
    }
  },


  // dashboard get request from client
  get: function(req, res){
    // tokenがなかったら処理を中止
    if(!this.state.token) {
      // console.log('token or tokenSecretがないので処理中止したよ');
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
        // console.log('クライアントにデータ送ったよ');
        self.state.isInitial = false;
      }
    ]);
  },


  // like
  like: function(req, res){
    // console.log('Likeリクエスト受信');

    var option = {
      id: req.param('id'),
      reblog_key: req.param('reblogKey'),
      liked: req.param('liked')
    };

    // すでにlikeされてたらスキップ
    if(option.liked){
      // console.log('Like済みなのでスキップ');
      return;
    }

    // インスタンス作成
    var client = new tumblr.Client({
      consumer_key: sails.config.TUMBLR_CONSUMER_KEY,
      consumer_secret: sails.config.TUMBLR_SECRET_KEY,
      token: decipher(this.state.token),
      token_secret: decipher(this.state.tokenSecret)
    });

    client.like(option.id, option.reblog_key, function(err, response){
      // console.log('Likeした');
      res.json({ successLike:true });
    });
  },


  // unlike
  unlike: function(req, res){
    // console.log('Likeリクエスト受信');

    var option = {
      id: req.param('id'),
      reblog_key: req.param('reblogKey'),
      liked: req.param('liked')
    };

    // すでにlikeされてたらスキップ
    if(!option.liked){
      // console.log('Like済みなのでスキップ');
      return;
    }

    // インスタンス作成
    var client = new tumblr.Client({
      consumer_key: sails.config.TUMBLR_CONSUMER_KEY,
      consumer_secret: sails.config.TUMBLR_SECRET_KEY,
      token: this.state.token,
      token_secret: this.state.tokenSecret
    });

    client.unlike(option.id, option.reblog_key, function(err, response){
      // console.log('Unikeした');
      res.json({ successUnlike:true });
    });
  },


  // reblog
  reblog: function(req, res){
    // console.log('Reblogリクエスト受信');

    var blogHost = this.state.username + '.tumblr.com';

    var option = {
      id: req.param('id'),
      reblog_key: req.param('reblogKey')
    };

    // インスタンス作成
    var client = new tumblr.Client({
      consumer_key: sails.config.TUMBLR_CONSUMER_KEY,
      consumer_secret: sails.config.TUMBLR_SECRET_KEY,
      token: this.state.token,
      token_secret: this.state.tokenSecret
    });

    client.reblog(blogHost, option, function(err, response){
      // console.log('Reblogした');
      res.json({ successReblog:true });
    });
  },


  // ダッシュボード取得用関数
  loadDb: function(callback){
    var self = this;

    // ブラウザリロード時になぜか2回呼ばれてしまうので…
    // 1回目だけ処理をスキップ
    if(self.state.isInitial){
      // console.log('1回目なので何もしないよ');
      return self.state.isInitial = false;
    }

    // console.log('2回目以降なのでloadDb()を実行');
    // console.log('今のpageNum: ', self.state.pageNum);

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
      reblog_info: true
    };

    // since_idを取得
    // dataが空かどうか調べる
    if(self.state.data.length > 0){
      // dataがある→最新の投稿のidをセット
      self.state.sinceId = self.state.data[0].id;
    }

    // ダッシュボードを取得
    // since_idがセットされてる→新しい記事取得後、ダッシュボードを取得
    if(self.state.sinceId > 0){
      client.dashboard({since_id:self.state.sinceId}, function(err, response){
        // 取得した中で最新の投稿の数をセット
        var newerItem = response.posts.length;
        // console.log('あたらしい記事が', newerItem, '件ある');

        // offsetをoffset+newerItemにする
        option.offset = option.offset + newerItem;

        getDb();
      });
    }
    // since_idがセットされてない→普通にダッシュボードを取得
    else {
      getDb();
    }

    function getDb(){
      client.dashboard(option, function(err, response){
        // console.log('offset: ', option.offset);

        // 取得したデータを結合
        var oldData = self.state.data;
        var newData = oldData.concat(response.posts);

        // 結合したデータをstate.dataに格納
        self.state.data = newData;
        // console.log('data: ', self.state.data);

        // 合計記事数をstate.articleTotalに入れる
        self.state.articleTotal = response.total_posts;

        // 値をアップデート
        self.state.pageNum += 1; //ページ番号を1つ増やす
        self.state.articleCount += self.state.limit; //取得記事合計をlimit(取得件数)分増やす
        // console.log('loadDb()終了後のarticleCount: ', self.state.articleCount);

        return callback(null);
      });
    };
  }
};