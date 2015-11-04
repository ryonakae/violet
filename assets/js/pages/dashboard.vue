<template>
  <div>
    <h2>Dashboard</h2>
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

      io.socket.on('connect', function(){
        console.log('ダッシュボードを表示');
        self.loadDb();
      });

      io.socket.on('disconnect', function(){
        console.log('Socket.ioを切断');
        io.socket.disconnect();
      });
    },

    methods: {
      loadDb: function(){
        console.log('サーバにリクエスト送ったよ');

        // ダッシュボード取得リクエストを送る
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          console.log('ダッシュボード取得したよ');
          console.log('data: ', body);
        });
      }
    }
  };
</script>