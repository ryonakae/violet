<template>
  <div id="app" v-el:app>
    <component-header></component-header>

    <router-view keep-alive></router-view>
  </div>
<template>

<script>
  module.exports = {
    data: function(){
      return {
        params: {}
      }
    }
  };
</script>