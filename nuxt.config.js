module.exports = {
  plugins: [
    { src: '~/plugins/persisted-state.js', ssr: false },
    { src: '~/plugins/auth.js', ssr: false }
  ]
}
