import createPersistedState from 'vuex-persistedstate'

export default ctx => {
  if (ctx.isHMR) return

  window.onNuxtReady(nuxt => {
    createPersistedState({
      key: 'violet-for-tumblr'
    })(ctx.store)
  })
}
