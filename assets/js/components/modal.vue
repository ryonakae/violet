<template>
  <div class="modal">
    <div>{{title}}</div>
    <p>{{description}}</p>
  </div>
</template>

<script>
  module.exports = {
    data: function(){
      return {
        title: 'modal dayo',
        description: 'modal no description dayo'
      }
    }
  };
</script>