<template>
  <div>
    <p>Violet for Tumblr</p>
    <a href="/auth">Sign In with Tumblr</a>

    <ul v-if="user">
      <li>
        <span>token: </span>
        <span>{{user.token}}</span>
      </li>
      <li>
        <span>tokenSecret: </span>
        <span>{{user.token}}</span>
      </li>
      <li>
        <span>username: </span>
        <span>{{user.profile.username}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user
    }
  }
}
</script>
