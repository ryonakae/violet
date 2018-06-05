export const state = () => ({
  user: null,
  isAuthed: false
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
    console.log('[SET_USER]', state.user)
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

      // セッションからユーザー情報をVuex Storeにセット
      commit('SET_USER', req.session.passport.user)

      // セッションを破棄する（サーバでユーザー情報を保持しない）
      req.session.destroy()
    } else {
      console.log('[nuxtServerInit] セッションがない')
    }
  },

  logout ({ commit }) {
    commit('SET_USER', null)
    commit('IS_AUTHED', false)
  }
}
