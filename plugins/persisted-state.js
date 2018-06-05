import createPersistedState from 'vuex-persistedstate'

export default ctx => {
  if (ctx.isHMR) return

  // nuxtServerInitでセットされたユーザー情報を一旦格納する
  const _user = ctx.store.state.user
  console.log('[persisted-state plugin] saved user info', _user)

  // storeを永続化
  console.log('[persisted-state plugin] fired')
  createPersistedState({
    key: 'violet-for-tumblr'
  })(ctx.store)

  // _userがnullじゃない（OAuth認証後コールバックでページにアクセスしたとき）ときだけ、
  // _userに保存したユーザー情報をstore.state.userにセットする
  if (_user) {
    console.log('[persisted-state plugin] set user')
    ctx.store.commit('SET_USER', _user)
  }
}
