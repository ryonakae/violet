<template>
  <div>
    <p>Violet for Tumblr</p>
    <a href="/auth">Sign In with Tumblr</a>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthed() {
      return this.$store.state.isAuthed
    }
  },

  created() {
    // 認証されている場合はdashboardにリダイレクト
    if (this.isAuthed) {
      this.$router.replace('/dashboard')
    }
  }
}
</script>
