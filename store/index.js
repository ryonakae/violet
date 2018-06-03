export const state = () => ({
  timestamp: 0,
  user: null,
  isAuthed: false
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
    console.log('[SET_USER] ユーザー情報をセット')
    console.log(user)
  },

  SET_TIMESTAMP (state) {
    const date = new Date()
    state.timestamp = Math.floor(date.getTime() / 1000)
    console.log('[SET_TIMESTAMP]', state.timestamp)
  },

  IS_AUTHED (state, boolean) {
    state.isAuthed = boolean
    console.log('[IS_AUTHED]', state.isAuthed)
  }
}

export const actions = {
  // サーバーにアクセスした時にサーバー上で実行されるアクション
  nuxtServerInit ({ commit }, { req }) {
    if (req.session.passport) {
      console.log('[nuxtServerInit] セッションがある')
      commit('SET_USER', req.session.passport.user)
      req.session.destroy()
    } else {
      console.log('[nuxtServerInit] セッションがない')
    }
  }
}
