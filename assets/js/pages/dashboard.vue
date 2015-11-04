<template>
  <div>
    <h2>Dashboard</h2>

    <h3>Posts</h3>
    <ul>
      <li v-for="item in data">
        <h4>{{item.date}}</h4>
        <p>id: {{item.id}} / {{item.note_count}} Notes</p>
      </li>
    </ul>

    <p v-on:click="loadDb" style='display:inline-block; background-color:#aaa; padding:10px;'>load dashboard</p>
  </div>
</template>

<script>
  var socketIO = require('../dependencies/socket.io.js');
  var io = require('../dependencies/sails.io.js')(socketIO);

  module.exports = {
    data: function(){
      return {
        data: []
      }
    },

    ready: function(){
      var self = this;

      // socket.io接続時の処理
      io.socket.on('connect', function(){
        console.log('ダッシュボードを表示');
        self.loadDb();
      });

      // socket.io切断時の処理
      io.socket.on('disconnect', function(){
        console.log('Socket.ioを切断');
        io.socket.disconnect();
      });
    },

    methods: {
      loadDb: function(){
        var self = this;

        // ダッシュボード取得リクエストを送る
        console.log('サーバにリクエスト送ったよ');
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          console.log('ダッシュボード取得したよ');
          self.$set('data', body);
          console.log(self.$get('data'));
        });
      }
    }
  };
</script>