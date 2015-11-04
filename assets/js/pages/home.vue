<template>
  <div>
    <h2>{{title}}</h2>
    <p>{{description}}</p>
    <ul>
      <li><a v-link="{path:'/about'}">About</a></li>
      <li><a href="/auth/tumblr/">Login</a></li>
    </ul>

    <my-modal></my-modal>
  </div>
</template>

<script>
  var modal = require('../components/modal.vue');

  module.exports = {
    data: function(){
      return {
        title: 'home dayo',
        description: 'home no description dayo'
      }
    },

    components: {
      'my-modal': modal
    }
  };
</script>