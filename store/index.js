export const state = () => ({
  user: null
})

export const mutations = {
  // ユーザー情報をセット
  SET_USER (state, user) {
    state.user = user
    console.log('[SET_USER] ユーザー情報をセット')
  }
}

export const actions = {
  // サーバーにアクセスした時にサーバー上で実行されるアクション
  nuxtServerInit ({ commit }, { req }) {
    if (req.session.passport) {
      console.log('[nuxtServerInit] セッションがあるで')
      commit('SET_USER', req.session.passport.user)
      req.session.destroy()
    } else {
      console.log('[nuxtServerInit] セッションがないで')
    }
  }
}
