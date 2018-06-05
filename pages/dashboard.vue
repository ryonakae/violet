<template>
  <div>
    <p>Dashboard</p>
    <button @click="logout">Logout</button>

    <ul v-if="user">
      <li>
        <span>token: </span>
        <span>{{user.token}}</span>
      </li>
      <li>
        <span>tokenSecret: </span>
        <span>{{user.tokenSecret}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthed() {
      return this.$store.state.isAuthed
    },

    user() {
      return this.$store.state.user
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.replace('/')
    }
  },

  created() {
    // 認証されていない場合はindexにリダイレクト
    if (!this.isAuthed) {
      this.$router.replace('/')
    }
  }
}
</script>
