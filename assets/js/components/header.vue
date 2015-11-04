<template>
  <header class="header">
    <h1 class="header__logo">
      <a v-if="!isAuth" v-link="{path:'/'}">{{title}}</a>
      <a v-else v-link="{path:'/dashboard'}">{{title}}</a>
    </h1>

    <nav class="header__navi">
      <div class="header__naviToggle">Menu</div>
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

  module.exports = {
    data: function(){
      return {
        title: 'Violet for Tumblr',
        isAuth: null
      }
    },

    created: function(){
      var self = this;

      // socket.ioでログイン状態を取得
      io.socket.get('/auth/isAuth', function serverRespondedWith (body, jwr){
        self.isAuth = body.isAuth;
        console.log('isAuth', self.isAuth);
      });
    }
  };
</script>