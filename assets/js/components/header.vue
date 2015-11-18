<template>
  <header class="header">
    <h1 class="header__logo">
      <a v-if="!isAuth" v-link="{path:'/'}">
        <img src="/images/header_logo.png" v-bind:alt="title" width="32" height="30">
      </a>
      <a v-else v-link="{path:'/dashboard'}">
      <img src="/images/header_logo.png" v-bind:alt="title" width="32" height="30">
      </a>
    </h1>

    <div class="header__toggle" v-on:click="naviToggle">
      <span class="header__toggleIcon"></span>
      <span class="header__toggleText">Menu</span>
    </div>

    <nav class="header__navi" v-el:navi>
      <ul class="header__naviList">
        <li class="header__naviListItem">
          <a v-if="!isAuth" v-link="{path:'/'}">トップページ</a>
          <a v-else v-link="{path:'/dashboard'}">ダッシュボード</a>
        </li>
        <li class="header__naviListItem">
          <a v-link="{path:'/about'}">Violet for Tumblrについて</a>
        </li>
        <li class="header__naviListItem">
          <a v-if="!isAuth" href="/auth/tumblr/">Tumblrアカウントではじめる</a>
          <a v-else href="/auth/logout">ログアウト</a>
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
          // console.log('isAuth', self.isAuth);
        });
      });

      // socket.io切断時の処理
      // io.socket.on('disconnect', io.socket.disconnect);
    },

    methods: {
      naviToggle: function(){
        var self = this;

        function naviOpen(){
          $(self.$els.navi).css({
            'visibility': 'visible'
          }).velocity({
            opacity: 1
          }, {
            duration: 200,
            complete: function(){
              self.$set('isNaviOpen', true);
            }
          });
        };

        function naviClose(){
          $(self.$els.navi).velocity({
            opacity: 0
          }, {
            duration: 200,
            complete: function(){
              self.$set('isNaviOpen', false);
              $(self.$els.navi).css({ 'visibility': 'hidden' });
            }
          });
        };

        // isNaviOpenがfalse→navi開く
        if(!self.$get('isNaviOpen')) naviOpen();

        // isNaviOpenがtrue→navi閉じる
        else naviClose();

        // ヘッダー内のリンククリック→閉じる
        $(self.$els.navi).find('a').on('click', naviClose);
      }
    }
  };
</script>