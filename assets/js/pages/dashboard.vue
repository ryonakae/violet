<template>
  <div>
    <h2>Dashboard</h2>

    <h3>Posts</h3>
    <p v-on:click="like(0)" style="display:inline-block; background-color:#aaa; padding:10px;">Like</p>
    <p v-on:click="unlike(0)" style="display:inline-block; background-color:#aaa; padding:10px;">Unike</p>
    <p v-on:click="reblog(0)" style="display:inline-block; background-color:#aaa; padding:10px;">Reblog</p>

    <p v-on:click="goPrev" style="display:inline-block; background-color:#aaa; padding:10px;">prev</p>
    <p style="display:inline-block; background-color:#aaa; padding:10px;">Like &amp; Reblog</p>
    <p v-on:click="goNext" style="display:inline-block; background-color:#aaa; padding:10px;">next</p>

    <ul>
      <li v-for="item in data">
        <h4>{{item.date}}</h4>
        <img v-if="item.photos[0].original_size.url" v-bind:src="item.photos[0].original_size.url" alt="" width="150"><br>
        <small>id: {{item.id}} / {{item.note_count}} Notes / Liked: {{item.liked}}</small>
      </li>

      <li class="scroll" style="display:block; height:1px; opacity:0;">scroll line</li>
    </ul>
  </div>
</template>

<script>
  var socketIO = require('../dependencies/socket.io.js');
  var io = require('../dependencies/sails.io.js')(socketIO);
  require('jquery');

  module.exports = {
    data: function(){
      return {
        data: [],
        dataLength: 0,
        itemCount: 0,
        scrollLock: false
      }
    },

    ready: function(){
      var self = this;

      console.log('dashboard表示');

      // socket.io接続時の処理
      io.socket.on('connect', function(){
        self.loadDb();

        // infinite scroll
        self.scroll();
      });

      // socket.io切断時の処理
      io.socket.on('disconnect', io.socket.disconnect);
    },

    methods: {
      // ダッシュボード取得リクエストを送る
      loadDb: function(){
        var self = this;

        console.log('サーバにリクエスト送信');
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          console.log('ダッシュボード取得完了');

          self.$set('data', body);
          self.$set('dataLength', self.$get('data').length); //取得した配列のlengthをdataLengthに入れる
          console.log(self.$get('data'));
          console.log('dataLength: ', self.$get('dataLength'));

          self.$set('scrollLock', false); //ロック解除
          console.log('scrollLock: ', self.$get('scrollLock'));
        });
      },

      // 前のitemに移動
      goPrev: function(){
        console.log('前のitemに移動');
        // ここにjQueryとか使って遷移の処理

        // itemCountを1つ増やす
        var count = this.$get('itemCount') -1;

        if(count < 0){
          return console.log('itemCountが0以下なので何もしないよ');
        }

        this.$set('itemCount', count);
        console.log('itemCount: ', this.$get('itemCount'));
      },

      // 次のitemに移動
      goNext: function(){
        console.log('次のitemに移動');
        // ここにjQueryとか使って遷移の処理

        // itemCountを1つ増やす
        var count = this.$get('itemCount') +1;

        if(count > this.$get('dataLength')*0.8){
          this.loadDb();
        }

        this.$set('itemCount', count);
        console.log('itemCount: ', this.$get('itemCount'));
      },

      // Like
      like: function(n){
        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key,
          liked: this.$get('data')[n].liked
        }

        // Like済みだったらスキップ
        if(sendData.liked){
          return console.log('Like済みなのでスキップ');
        }

        io.socket.post('/dashboard/like', sendData, function(data, jwres){
          console.log(data);
          self.$get('data')[n].liked = true;
        })
      },

      // Unlike
      unlike: function(n){
        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key,
          liked: this.$get('data')[n].liked
        }

        // unike済みだったらスキップ
        if(!sendData.liked){
          return console.log('Unlike済みなのでスキップ');
        }

        io.socket.post('/dashboard/unlike', sendData, function(data, jwres){
          console.log(data);
          self.$get('data')[n].liked = false;
        })
      },

      // Reblog
      reblog: function(n){
        var self = this;

        var sendData = {
          id: this.$get('data')[n].id,
          reblogKey: this.$get('data')[n].reblog_key
        }

        io.socket.post('/dashboard/reblog', sendData, function(data, jwres){
          console.log(data);
        })
      },

      // infinite scroll
      scroll: function(){
        var self = this;

        var scroll = 0;
        var winHeight;
        var offset;

        $(window).on('scroll', function(e){
          scroll = $(window).scrollTop();
          winHeight = $(window).height();
          offset = $('.scroll').offset().top;

          if(scroll+winHeight > offset*0.85){
            if(self.$get('scrollLock')) return; //多重読み込み防止

            self.$set('scrollLock', true); //ロックする
            console.log('scrollLock: ', self.$get('scrollLock'));
            self.loadDb();
          }
        });
      }
    }
  };
</script>