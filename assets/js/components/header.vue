<template>
  <header class="header" id="header">
    <h1 class="header__logo">
      <a v-if="!isAuth" v-link="{path:'/'}">
        <img src="/images/header_logo.png" v-bind:alt="title" width="34" height="32">
      </a>
      <a v-else v-link="{path:'/dashboard'}">
      <img src="/images/header_logo.png" v-bind:alt="title" width="34" height="32">
      </a>
    </h1>

    <div class="header__toggle" id="headerToggle" v-on:click="naviToggle"></div>

    <nav class="header__navi" id="headerNavi">
      <ul class="header__naviList">
        <li class="header__naviListItem">
          <a v-if="!isAuth" v-link="{path:'/'}">Home</a>
          <a v-else v-link="{path:'/dashboard'}">Home</a>
        </li>
        <li class="header__naviListItem">
          <a v-link="{path:'/about'}">About</a>
        </li>
        <li class="header__naviListItem">
          <a v-if="!isAuth" href="/auth/tumblr/">Login</a>
          <a v-else href="/auth/logout">Logout</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
  var socketIO = require('../dependencies/socket.io.js');
  var io = require('../dependencies/sails.io.js')(socketIO);
  require('jquery');
  var velocity = require('velocity');

  module.exports = {
    data: function(){
      return {
        title: 'Violet for Tumblr',
        isAuth: null,
        isNaviOpen: false
      }
    },

    ready: function(){
      var self = this;

      // socket.io切断時の処理
      io.socket.on('connect', function(){
        // socket.ioでログイン状態を取得
        io.socket.get('/auth/isAuth', function serverRespondedWith (body, jwr){
          self.isAuth = body.isAuth;
          console.log('isAuth', self.isAuth);
        });
      });

      // socket.io切断時の処理
      io.socket.on('disconnect', io.socket.disconnect);
    },

    methods: {
      naviToggle: function(){
        var self = this;

        function naviOpen(){
          $('#headerNavi').css({
            'visibility': 'visible'
          }).velocity({
            opacity: 1
          }, {
            duration: 300,
            complete: function(){
              self.$set('isNaviOpen', true);
            }
          });
        };

        function naviClose(){
          $('#headerNavi').velocity({
            opacity: 0
          }, {
            duration: 300,
            complete: function(){
              self.$set('isNaviOpen', false);
              $('#headerNavi').css({ 'visibility': 'hidden' });
            }
          });
        };

        // isNaviOpenがfalse→navi開く
        if(!self.$get('isNaviOpen')) naviOpen();

        // isNaviOpenがtrue→navi閉じる
        else naviClose();

        // ヘッダー内のリンククリック→閉じる
        $('#header a').on('click', naviClose);
      }
    }
  };
</script>