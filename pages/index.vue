<template>
  <div>
    <p>Violet for Tumblr</p>
    <p><a href="/auth">Sign In with Tumblr</a></p>
    <p><nuxt-link to="/dashboard">Dashboard</nuxt-link></p>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthed() {
      return this.$store.state.isAuthed
    }
  },

  fetch() {
    console.log('[index fetch]', this.isAuthed)
  },

  beforeCreate() {
    console.log('[index beforeCreate]', this.isAuthed)
  },

  created() {
    console.log('[index created]', this.isAuthed)

    // 認証されている場合はdashboardにリダイレクト
    if (this.isAuthed) {
      this.$router.replace('/dashboard')
    }
  },

  mounted() {
    console.log('[index mounted]', this.isAuthed)
  }
}
</script>
