export default ctx => {
  console.log('[auth middleware]')

  if (ctx.store.state.user) {
    ctx.store.commit('IS_AUTHED', true)
  }
}
