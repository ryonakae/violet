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

  fetch() {
    console.log('[dashboard fetch]', this.isAuthed)
  },

  beforeCreate() {
    console.log('[dashboard beforeCreate]', this.isAuthed)
  },

  created() {
    console.log('[dashboard created]', this.isAuthed)

    // 認証されていない場合はindexにリダイレクト
    if (!this.isAuthed) {
      this.$router.replace('/')
    }
  },

  mounted() {
    console.log('[dashboard mounted]', this.isAuthed)
  }
}
</script>
