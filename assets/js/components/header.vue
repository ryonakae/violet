<template>
  <header class="header">
    <h1 class="header__logo">
      <a v-link="{path:'/'}">{{title}}</a>
    </h1>

    <nav class="header__navi">
      <div class="header__naviToggle">Menu</div>
      <ul class="header__naviList" style="display:none;">
        <li class="header__naviListItem">
          <a v-link="{path:'/'}">Home</a>
        </li>
        <li class="header__naviListItem">
          <a v-link="{path:'/about'}">About</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
  module.exports = {
    data: function(){
      return {
        title: 'Violet for Tumblr'
      }
    }
  };
</script>