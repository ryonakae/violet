<template>
  <div>
    <h2>Dashboard</h2>

    <h3>Posts</h3>
    <ul>
      <li v-for="item in data">
        <h4>{{item.date}}</h4>
        <img v-if="item.photos[0].original_size.url" v-bind:src="item.photos[0].original_size.url" alt="" width="150"><br>
        <small>id: {{item.id}} / {{item.note_count}} Notes</small>
      </li>

      <li class="scroll">scroll line</li>
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
      loadDb: function(){
        var self = this;

        // ダッシュボード取得リクエストを送る
        console.log('サーバにリクエスト送信');
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          console.log('ダッシュボード取得完了');

          self.$set('data', body);
          console.log(self.$get('data'));

          self.$set('scrollLock', false); //ロック解除
          console.log('scrollLock: ', self.$get('scrollLock'));
        });
      },

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