export default ctx => {
  console.log('[auth plugin]')

  if (ctx.store.state.user) {
    ctx.store.commit('IS_AUTHED', true)
  } else {
    ctx.store.commit('IS_AUTHED', false)
  }
}
