<template>
  <div id="app">
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