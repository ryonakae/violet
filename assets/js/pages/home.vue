<template>
  <div>
    <h2>{{title}}</h2>
    <p>{{description}}</p>
    <ul>
      <li><a v-link="{path:'/about'}">About</a></li>
      <li><a href="/auth/tumblr/">Login</a></li>
    </ul>
  </div>
</template>

<script>
  // var modal = require('../components/modal.vue');

  module.exports = {
    data: function(){
      return {
        title: 'Index',
        description: 'home no description dayo'
      }
    },

    // components: {
    //   'my-modal': modal
    // }
  };
</script>