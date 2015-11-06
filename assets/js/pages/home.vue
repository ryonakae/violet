<template>
  <div>
    <h2>{{title}}</h2>
    <p>{{description}}</p>
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

    ready: function(){
      console.log('Index表示');
    }

    // components: {
    //   'my-modal': modal
    // }
  };
</script>