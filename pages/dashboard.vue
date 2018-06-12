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
  computed: {
    isAuthed() {
      return this.$store.state.isAuthed
    },

    user() {
      return this.$store.state.user
    }
  },

  methods: {
    async getDashboard() {
      // const data = await this.$axios.$get(
      //   'https://api.tumblr.com/v2/user/dashboard',
      //   {
      //     params: {
      //       consumer_key: config.TUMBLR_CONSUMER_KEY,
      //       consumer_secret: config.TUMBLR_SECRET_KEY,
      //       token: this.user.token,
      //       token_secret: this.user.tokenSecret
      //     }
      //   }
      // )

      const client = tumblr.createClient({
        credentials: {
          consumer_key: config.TUMBLR_CONSUMER_KEY,
          consumer_secret: config.TUMBLR_SECRET_KEY,
          token: this.user.token,
          token_secret: this.user.tokenSecret
        },
        returnPromises: true
      })

      const data = await client.userDashboard()

      console.log('[getDashboard]', data)
    }
  },

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
    this.getDashboard()
  }
}
</script>
