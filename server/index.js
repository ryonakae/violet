const { Nuxt, Builder } = require('nuxt')
const app = require('express')()
const passport = require('passport')
const TumblrStrategy = require('passport-tumblr').Strategy
const bodyParser = require('body-parser')
const session = require('express-session')

const config = require('./config')
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const nuxtConfig = require('../nuxt.config.js')
nuxtConfig.dev = !(process.env.NODE_ENV === 'production')

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
      callbackURL: 'http://127.0.0.1:3000/auth/callback'
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
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
  })
)
app.use(passport.initialize())
app.use(passport.session())

// app routing
app.get('/auth', passport.authenticate('tumblr'))

app.get(
  '/auth/callback',
  passport.authenticate('tumblr', { failureRedirect: '/' }),
  (req, res) => {
    setTimeout(() => {
      res.redirect('/')
    }, 2000)
  }
)

// Create Nuxt.js instance
const nuxt = new Nuxt(nuxtConfig)

// ホットリローディングする開発モードのときのみビルドする
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// すべてのルートを Nuxt.js でレンダリングする
app.use(nuxt.render)

app.listen(port, host)
console.log('Server listening on http://' + host + ':' + port)
