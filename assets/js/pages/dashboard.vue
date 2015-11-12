<template>
  <div class="main main--dashboard">
    <div class="dashboard">
      <ul class="dashboard__list" v-el:list v-bind:style="{ width: listWidth }">
        <component-entry
          v-for="item in data"
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
  </div>
</template>

<script>
  var socketIO = require('../dependencies/socket.io.js');
  var io = require('../dependencies/sails.io.js')(socketIO);
  require('jquery');
  require('jquery-easing');
  require('velocity');
  var async = require('async');

  var entry = require('../components/entry.vue');
  var controller = require('../components/controller.vue');
  var toast = require('../components/toast.vue');

  module.exports = {
    components: {
      'component-entry': entry,
      'component-controller': controller,
      'component-toast': toast
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
        reblogLock: false
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
      io.socket.on('connect', this.loadDb);

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

        // console.log('サーバにリクエスト送信');
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          // console.log('ダッシュボード取得完了');

          self.$set('data', body);
          self.$set('dataLength', self.$get('data').length); //取得した配列のlengthをdataLengthに入れる
          console.log(self.$get('data'));
          console.log('dataLength: ', self.$get('dataLength'));

          // toast消す
          self.toastHide('ダッシュボードの読み込みが完了しました。');

          if(callback) return callback(null);
        });
      },

      // 前のitemに移動
      goPrev: function(){
        // console.log('前のitemに移動');

        // itemCountを1つ減らす
        var count = this.$get('itemCount') -1;

        if(count < 0){
          // console.log('itemCountが0以下なので何もしないよ');
          return;
        }

        this.$set('itemCount', count);
        console.log('itemCount: ', this.$get('itemCount'));

        // 前のアイテムにスライド
        this.sldePrev();
      },

      // 次のitemに移動
      goNext: function(){
        // console.log('次のitemに移動');

        // 投稿数(dataLength)が250以上、かつitemCountが250になったら
        // toast出してダッシュボードこれ以上読み込まない
        if( this.$get('dataLength') >= 250 && this.$get('itemCount') === 250 ){
          this.toastShow('これ以上読み込めません。');
          this.toastHide('これ以上読み込めません。');
          return;
        }

        // lock済みだったら以下スキップ
        if(this.$get('loadLock')) return;

        // itemCountを1つ増やす
        var count = this.$get('itemCount') +1;

        // 最後の方まで来たらダッシュボードを更新
        if(count > this.$get('dataLength')-5){
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

        this.$set('itemCount', count);
        console.log('itemCount: ', this.$get('itemCount'));

        // 次のアイテムにスライド
        this.sldeNext();
      },

      // Like
      like: function(n){
        // lock済みだったら以下スキップ
        if(this.$get('likeLock')) return;
        // lockする
        this.$set('likeLock', true);

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
        })
      },

      // Unlike
      unlike: function(n){
        // lock済みだったら以下スキップ
        if(this.$get('likeLock')) return;
        // lockする
        this.$set('likeLock', true);

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
        })
      },

      // Reblog
      reblog: function(n){
        // lock済みだったら以下スキップ
        if(this.$get('reblogLock')) return;
        // lockする
        this.$set('reblogLock', true);

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
        })
      },

      sldePrev: function(){
        var self = this;

        $(this.$els.list).velocity({
          translateX: this.$get('marginLeft') + this.$get('winWidth')
        },{
          duration: 400,
          easing: 'easeOutQuart',
          complete: function(){
            self.$set('marginLeft', self.$get('marginLeft') + self.$get('winWidth'));
          }
        });
        console.log('slide prev');
      },

      sldeNext: function(){
        var self = this;

        $(this.$els.list).velocity({
          translateX: this.$get('marginLeft') - this.$get('winWidth')
        },{
          duration: 400,
          easing: 'easeOutQuart',
          complete: function(){
            self.$set('marginLeft', self.$get('marginLeft') - self.$get('winWidth'));
          }
        });
        console.log('slide next');
      },

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
      }
    }
  };
</script>