export const state = () => ({
  user: null
})

export const mutations = {
  SET_USER (state, user) {
    state.user = user
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.passport) {
      commit('SET_USER', req.session.passport.user)
    }
  }
}
