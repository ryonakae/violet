<template>
  <div>
    <p>Violet for Tumblr</p>
    <a href="/auth">Sign In with Tumblr</a>

    <p>isAuthed: {{isAuthed}}</p>

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
    user() {
      return this.$store.state.user
    },
    isAuthed() {
      return this.$store.state.isAuthed
    }
  },

  created() {}
}
</script>
