import tumblr from 'tumblr.js'
import config from '~/server/config'

export const state = () => ({
  user: null,
  isAuthed: false,
  client: null,
  posts: {}
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
    console.log('[SET_USER]', state.user)
  },

  IS_AUTHED (state, boolean) {
    state.isAuthed = boolean
    console.log('[IS_AUTHED]', state.isAuthed)
  },

  CREATE_CLIENT (state) {
    state.client = tumblr.createClient({
      credentials: {
        consumer_key: config.TUMBLR_CONSUMER_KEY,
        consumer_secret: config.TUMBLR_SECRET_KEY,
        token: state.user.token,
        token_secret: state.user.tokenSecret
      },
      returnPromises: true
    })
  },

  SET_POSTS (state, data) {
    state.posts = data
  }
}

export const actions = {
  // サーバーにアクセスした時にサーバー上で実行されるアクション
  nuxtServerInit ({ commit }, { req }) {
    console.log('[nuxtServerInit]')

    if (req.session.passport) {
      console.log('[persisted-state plugin: server] セッションがある')

      // セッションからユーザー情報をVuex Storeにセット
      commit('SET_USER', req.session.passport.user)
    } else {
      console.log('[persisted-state plugin: server] セッションがない')
    }

    // セッションを破棄する（サーバでユーザー情報を保持しない）
    req.session.destroy()
  },

  logout ({ commit }) {
    commit('SET_USER', null)
    commit('IS_AUTHED', false)
  },

  async getDashboard ({ state, commit }, params) {
    try {
      if (!state.client) commit('CREATE_CLIENT')
      console.log(state.client.userDashboard)
      const data = await state.client.userDashboard()
      commit('SET_POSTS', data)
      console.log('[getDashboard]', state.posts)
    } catch (err) {
      console.error('[getDashboard]', err)
    }
  }
}
