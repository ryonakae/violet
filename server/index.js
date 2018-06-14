const app = require('express')()
const passport = require('passport')
const TumblrStrategy = require('passport-tumblr').Strategy
const bodyParser = require('body-parser')
const session = require('express-session')

const config = require('./config')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const { Nuxt, Builder } = require('nuxt')
const nuxtConfig = require('../nuxt.config.js')
const nuxt = new Nuxt(nuxtConfig)

// passport settings
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((obj, done) => {
  done(null, obj)
})
passport.use(
  new TumblrStrategy(
    {
      consumerKey: config.TUMBLR_CONSUMER_KEY,
      consumerSecret: config.TUMBLR_SECRET_KEY,
      callbackURL: 'http://' + host + ':' + port + '/auth/callback'
    },
    (token, tokenSecret, profile, done) => {
      const userInfo = {
        token: token,
        tokenSecret: tokenSecret,
        profile: profile
      }

      process.nextTick(() => {
        return done(null, userInfo)
      })
    }
  )
)

// app settings
app.use(bodyParser.json())
app.use(
  session({
    secret: 'violet-for-tumblr',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth', passport.authenticate('tumblr'))

app.get(
  '/auth/callback',
  passport.authenticate('tumblr', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
  })
)

// ホットリローディングする開発モードのときのみビルドする
if (nuxt.options.dev) new Builder(nuxt).build()

// すべてのルートを Nuxt.js でレンダリングする
app.use(nuxt.render)

app.listen(port, host)
console.log('Server listening on http://' + host + ':' + port)
