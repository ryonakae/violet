module.exports = {
  plugins: [{ src: '~/plugins/persisted-state.js', ssr: false }],
  router: {
    middleware: 'auth'
  }
}
