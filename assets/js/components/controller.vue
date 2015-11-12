<template>
  <div class="controller">
    <div class="controller__prev" v-on:click="goPrev">
      <span>Prev</span>
    </div>
    <div v-on:click="[like(itemCount), reblog(itemCount)]" class="controller__likeReblog">
      <span v-if="!data[itemCount].liked" class="controller__likeReblogIcon">Like & Reblog</span>
      <span v-if="data[itemCount].liked" class="controller__likeReblogIcon controller__likeReblogIcon--liked">Like & Reblog</span>
    </div>
    <div class="controller__next" v-on:click="goNext">
      <span>Next</span>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: ['data', 'itemCount', 'goPrev', 'goNext', 'like', 'reblog']
  };
</script>