import createPersistedState from 'vuex-persistedstate'

export default ctx => {
  if (ctx.isHMR) return

  console.log('before window.onNuxtReady')
  window.onNuxtReady(nuxt => {
    createPersistedState()(ctx.store)
  })
}
