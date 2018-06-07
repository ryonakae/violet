import createPersistedState from 'vuex-persistedstate'

export default ({ store, isHMR }) => {
  if (isHMR) return

  // サーバーで保存したユーザー情報をlocalStorageに保存して永続化する
  const _user = store.state.user
  console.log('[persisted-state plugin] save userInfo', _user)

  // storeを永続化
  console.log('[persisted-state plugin] createPersistedState')
  createPersistedState({
    key: 'violet-for-tumblr'
  })(store)

  // _userがnullじゃない（OAuth認証後コールバックでページにアクセスしたとき）ときだけ、
  // _userに保存したユーザー情報をstore.state.userにセットする
  if (_user) {
    console.log('[persisted-state plugin] set userInfo')
    store.commit('SET_USER', _user)
  }
}
