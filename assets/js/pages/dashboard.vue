<template>
  <div class="main main--dashboard">
    <div class="dashboard">
      <ul class="dashboard__list" v-el:list v-bind:style="{ width: listWidth }">
        <component-entry
          v-for="item in data"
          track-by="id"
          :item="item"
          :item-count="itemCount"
          :win-width="winWidth"
          :win-height="winHeight"
          :like="like"
          :unlike="unlike"
          :reblog="reblog">
        </component-entry>
      </ul>
    </div>

    <component-controller
      :data="data"
      :item-count="itemCount"
      :go-prev="goPrev"
      :go-next="goNext"
      :like="like"
      :reblog="reblog"
      >
    </component-controller>

    <component-toast v-el:toast :toast-msg="toastMsg"></component-toast>

    <div class="counter">
      <span class="counter__now">{{itemCount + 1}}</span>
      <span class="counter__total">{{dataLength}}</span>
    </div>
  </div>
</template>

<script>
  var socketIO = require('../dependencies/socket.io.js');
  var io = require('../dependencies/sails.io.js')(socketIO);

  require('jquery');
  require('jquery-easing');
  require('velocity');
  var async = require('async');


  module.exports = {
    components: {
      'component-entry': require('../components/entry.vue'),
      'component-controller': require('../components/controller.vue'),
      'component-toast': require('../components/toast.vue')
    },


    data: function(){
      return {
        data: [],
        dataLength: 0,
        itemCount: 0,
        winWidth: $(this.$parent.$els.app).width(),
        winHeight: window.innerHeight,
        marginLeft: 0,
        toastMsg: '',
        loadLock: false,
        likeLock: false,
        reblogLock: false,
        moveLock: false,
        username: ''
      }
    },


    computed: {
      listWidth: function(){
        return this.$get('winWidth') * this.$get('dataLength') + 'px';
      }
    },


    ready: function(){
      var self = this;

      // console.log('dashboard表示');

      // socket.io接続時の処理
      io.socket.on('connect', function(){
        self.loadDb();

        // ユーザー名取得
        io.socket.get('/dashboard/username', function serverRespondedWith (body, jwr){
          return self.$set('username', body.username);
        });
      });

      // socket.io切断時の処理
      io.socket.on('disconnect', io.socket.disconnect);

      $(window).on('load resize', function(){
        self.$set('winWidth', $(self.$parent.$els.app).width());
        self.$set('winHeight', window.innerHeight);
      });

      // キーボード操作
      $(window).on('keyup', function(e){
        // k or left ...戻る
        if( e.keyCode === 75 || e.keyCode === 37 ) {
          self.goPrev();
        }
        // j or right ...進む
        if( e.keyCode === 74 || e.keyCode === 39 ) {
          self.goNext();
        }
        // space ...スクロール
        if( e.keyCode === 32 ) {
          self.scroll(self.$get('itemCount'));
        }
        // l ...Like / unlike
        if( e.keyCode === 76 ) {
          // like済みならunlike、そうでなければ普通にlike
          if( self.$get('data')[self.$get('itemCount')].liked ){
            self.unlike(self.$get('itemCount'));
          }
          else {
            self.like(self.$get('itemCount'));
          }
        }
        // r ...Reblog
        if( e.keyCode === 82 ) {
          self.reblog(self.$get('itemCount'));
        }
        // v ...like & Reblog
        if( e.keyCode === 86 ) {
          self.like(self.$get('itemCount'));
          self.reblog(self.$get('itemCount'));
        }
      });
    },


    methods: {
      // ダッシュボード取得リクエストを送る
      loadDb: function(callback){
        var self = this;

        // toast出す
        this.toastShow('ダッシュボードを読み込んでいます…');

        // サーバにリクエスト送信
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          // async.seriesで順番に実行
          async.series([
            function(callback){
              // 取得した配列をフィルタリング(自分がReblogしたやつは弾く)
              // reblogged_from_nameと自分のusernameを比べる
              var allData = body;
              var filteredData = $.grep(allData, function(data){
                return data.reblogged_from_name !== self.$get('username');
              });

              // dataに取得・フィルタリングした配列をセット
              self.$set('data', filteredData);
              //取得した配列のlengthをdataLengthに入れる
              self.$set('dataLength', self.$get('data').length);
              // console.log(self.$get('data'));
              // console.log('dataLength: ', self.$get('dataLength'));
              callback(null);
            },
            function(callback){
              // toast消す
              self.toastHide('ダッシュボードの読み込みが完了しました。');
              // 範囲内のアイテムだけ表示
              self.itemShow(callback);
              // lock解除
              self.$set('moveLock', false);
            }
          ]);

          if(callback) return callback(null);
        });
      },

      // 前のitemに移動
      goPrev: function(){
        // lock済みだったら以下スキップ
        if(this.$get('moveLock')) return;
        // lockする
        this.$set('moveLock', true);

        // console.log('前のitemに移動');

        // itemCountを1つ減らす
        var count = this.$get('itemCount') -1;

        // itemCountが0以下なら何もしない
        if(count < 0) {
          // moveLockは解除
          return this.$set('moveLock', false);
        }

        this.$set('itemCount', count);
        // console.log('itemCount: ', this.$get('itemCount'));

        // 範囲内のアイテムだけ表示
        this.itemShow();

        // 前のアイテムにスライド
        this.sldePrev();
      },

      // 次のitemに移動
      goNext: function(){
        // lock済みだったら以下スキップ
        if(this.$get('moveLock')) return;
        // lockする
        this.$set('moveLock', true);

        // console.log('次のitemに移動');

        // 投稿数(dataLength)が250以上、かつitemCountが250になったら
        // toast出してダッシュボードこれ以上読み込まない
        if( this.$get('dataLength') >= 250 && this.$get('itemCount') === 250 ){
          this.toastShow('これ以上読み込めません。');
          return this.toastHide('これ以上読み込めません。');
        }

        // lock済みだったら以下スキップ
        if(this.$get('loadLock')) return;

        // 最後まで来たらダッシュボードを更新
        if(this.$get('itemCount') > this.$get('dataLength') -3){
          var self = this;

          // async.seriesで順番に実行
          async.series([
            function(callback){
              // lockする
              self.$set('loadLock', true);
              callback(null);
            },
            function(callback){
              // ダッシュボード読み込み
              self.loadDb(callback);
            },
            function(callback){
              // lock解除
              self.$set('loadLock', false);
            }
          ]);
        }

        // itemCountを1つ増やす
        this.$set('itemCount', this.$get('itemCount') +1);
        // console.log('itemCount: ', this.$get('itemCount'));

        // 範囲内のアイテムだけ表示
        this.itemShow();

        // 次のアイテムにスライド
        this.sldeNext();
      },

      // Like
      like: function(n){
        // lock済みだったら以下スキップ
        if(this.$get('likeLock')) return;
        // lockする
        this.$set('likeLock', true);
        this.$set('moveLock', true);

        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key,
          liked: this.$get('data')[n].liked
        }

        // Like済みだったら以下スキップ
        if(sendData.liked) return;

        // toast出す
        this.toastShow('Likeしています…');

        io.socket.post('/dashboard/like', sendData, function(data, jwres){
          // console.log(data);
          self.$get('data')[n].liked = true;

          // toast消す
          self.toastHide('Likeしました。');

          // lock解除
          self.$set('likeLock', false);
          self.$set('moveLock', false);
        });
      },

      // Unlike
      unlike: function(n){
        // lock済みだったら以下スキップ
        if(this.$get('likeLock')) return;
        // lockする
        this.$set('likeLock', true);
        this.$set('moveLock', true);

        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key,
          liked: this.$get('data')[n].liked
        }

        // unike済みだったらスキップ
        if(!sendData.liked) return;

        // toast出す
        this.toastShow('Likeを取り消しています…');

        io.socket.post('/dashboard/unlike', sendData, function(data, jwres){
          // console.log(data);
          self.$get('data')[n].liked = false;

          // toast消す
          self.toastHide('Likeを取り消しました。');

          // lock解除
          self.$set('likeLock', false);
          self.$set('moveLock', false);
        });
      },

      // Reblog
      reblog: function(n){
        // lock済みだったら以下スキップ
        if(this.$get('reblogLock')) return;
        // lockする
        this.$set('reblogLock', true);
        this.$set('moveLock', true);

        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key
        }

        // toast出す
        this.toastShow('Reblogしています…');

        io.socket.post('/dashboard/reblog', sendData, function(data, jwres){
          // console.log(data);

          // toast消す
          self.toastHide('Reblogしました。');

          // lock解除
          self.$set('reblogLock', false);
          self.$set('moveLock', false);
        })
      },

      // スライドアニメーション Prev
      sldePrev: function(){
        var self = this;

        $(this.$els.list).velocity({
          translateX: this.$get('marginLeft') + this.$get('winWidth')
        },{
          duration: 400,
          easing: 'easeOutQuart',
          complete: function(){
            self.$set('marginLeft', self.$get('marginLeft') + self.$get('winWidth'));
            // lock解除
            self.$set('likeLock', false);
            self.$set('reblogLock', false);
            self.$set('moveLock', false);
          }
        });
        // console.log('slide prev');
      },

      // スライドアニメーション Next
      sldeNext: function(){
        var self = this;

        $(this.$els.list).velocity({
          translateX: this.$get('marginLeft') - this.$get('winWidth')
        },{
          duration: 400,
          easing: 'easeOutQuart',
          complete: function(){
            self.$set('marginLeft', self.$get('marginLeft') - self.$get('winWidth'));
            // lock解除
            self.$set('likeLock', false);
            self.$set('reblogLock', false);
            self.$set('moveLock', false);
          }
        });
        // console.log('slide next');
      },

      // スクロールアニメーション
      scroll: function(itemCount){
        var element = $(this.$els.list).children().eq(itemCount);

        // itemCountと同じ番目のliのスクロール位置を取得
        var scroll = element.scrollTop();

        // スクロールする
        // element.scrollTop(scroll + $(window).height() * 0.7);
        element.animate({scrollTop: scroll + this.$get('winHeight') * 0.65}, 350, 'easeOutQuart');
      },

      // toastを表示
      toastShow: function(msg){
        var self = this;

        $(this.$els.toast).velocity({
          opacity: 1
        }, {
          duration: 200,
          begin: function(){
            self.$set('toastMsg', msg);
          }
        });
      },

      // toastを非表示
      toastHide: function(msg){
        var self = this;

        this.$set('toastMsg', msg);

        $(this.$els.toast).velocity({
          opacity: 0
        }, {
          duration: 200,
          delay: 1500,
          complete: function(){
            self.$set('toastMsg', '');
          }
        });
      },

      // 描画領域内のアイテムだけ表示
      itemShow: function(callback){
        var className = 'dashboard__listItem--show';
        var itemCount = this.$get('itemCount');

        // remove class = 全部非表示
        $(this.$els.list).children().removeClass(className);

        if(itemCount == 0){
          // itemCountと、その後1つは表示
          $(this.$els.list).children().slice(0, 2).addClass(className);
          // $(this.$els.list).children().eq(0).addClass(className);
          // $(this.$els.list).children().eq(1).addClass(className);
        } else {
          // itemCountと、その前後1ずつは表示
          $(this.$els.list).children().slice(itemCount - 1, itemCount + 2).addClass(className);
        }

        if(callback) return callback(null);
      }
    }
  };
</script>