<template>
  <div class="main main--index">
    <h2>Index</h2>
    <p><a href="/auth/tumblr">Login with Tumblr</a></p>
  </div>
</template>

<script>
  module.exports = {
    data: function(){
      return {
        title: 'Index'
      }
    },

    ready: function(){
      console.log('Index表示');
    }
  };
</script>