<template>
  <div>
    <p>Dashboard</p>

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
import tumblr from 'tumblr.js'
import config from '~/server/config'

export default {
  data() {
    return {
      data: {}
    }
  },

  computed: {
    isAuthed() {
      return this.$store.state.isAuthed
    },

    user() {
      return this.$store.state.user
    }
  },

  methods: {},

  fetch({ redirect }) {
    console.log('[dashboard fetch]', this.isAuthed)

    // サーバーではダッシュボードにアクセスしたらトップにリダイレクトする
    if (process.server) {
      return redirect('/')
    }
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
    this.$store.dispatch('getDashboard')
  }
}
</script>
