<template>
  <div>
    <h2>About</h2>
    <ul>
      <li><a v-link="{path:'/'}">Home</a></li>
    </ul>
  </div>
</template>

<script>
  module.exports = {
    ready: function(){
      console.log('About表示');
    }
  }
</script>