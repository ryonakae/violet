<template>
  <div id="app">
    <header class="header">
      <h1 class="header__logo">
        <a v-link="{path:'/'}">Violet for Tumblr</a>
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

    <router-view></router-view>
  </div>
<template>