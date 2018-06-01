<template>
  <div>
    <h1>Violet for Tumblr</h1>
    <nuxt-link to="/">sign in with Tumblr</nuxt-link>
  </div>
</template>

<script>
export default {
  mounted(){
    console.log(this.$store.state.oauth)
  }
}
</script>
