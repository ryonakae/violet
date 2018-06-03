import createPersistedState from 'vuex-persistedstate'

export default ctx => {
  if (ctx.isHMR) return

  createPersistedState({
    key: 'violet-for-tumblr'
  })(ctx.store)
}
