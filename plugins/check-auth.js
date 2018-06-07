export default ({ store }) => {
  console.log('[check-auth plugin]')

  if (store.state.user) {
    store.commit('IS_AUTHED', true)
  } else {
    store.commit('IS_AUTHED', false)
  }
}
