module.exports = {
  loading: false,
  plugins: [
    { src: '~/plugins/persisted-state.js', ssr: false },
    { src: '~/plugins/check-auth.js', ssr: false }
  ],
  router: {
    middleware: 'sample'
  },
  build: {
    vendor: ['tumblr.js'],
    extend (config) {
      config.node = {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      }
    }
  }
}
