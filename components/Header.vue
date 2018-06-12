<template>
  <header>
    <p>Violet for Tumblr</p>

    <ul class="menu">
      <li>
        <nuxt-link class="menu-item" :to="homeUrl">Home</nuxt-link>
      </li>
      <li>
        <nuxt-link class="menu-item" to="/about">About</nuxt-link>
      </li>
      <li v-if="isAuthed">
        <span class="menu-item" @click="logout">Logout</span>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  computed: {
    isAuthed() {
      return this.$store.state.isAuthed
    },

    homeUrl() {
      return this.isAuthed ? '/dashboard' : '/'
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.replace('/')
    }
  }
}
</script>
