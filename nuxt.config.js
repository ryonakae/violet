module.exports = {
  plugins: [
    { src: '~/plugins/persisted-state.js', ssr: false },
    { src: '~/plugins/check-auth.js', ssr: false }
  ],
  router: {
    middleware: 'sample'
  }
}
