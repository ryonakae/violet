<template>
  <div>
    <h2>Dashboard</h2>
    <p v-on:click="loadDb" style='display:inline-block; background-color:#aaa; padding:10px;'>load dashboar</p>
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
      this.loadDb();
    },

    methods: {
      loadDb: function(){
        console.log('サーバにリクエスト送ったよ');
        // ダッシュボード取得リクエストを送る
        io.socket.get('/dashboard/get', function serverRespondedWith (body, jwr){
          console.log('data: ', body);
        });
      }
    }
  };
</script>