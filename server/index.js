const passport = require('passport')
const TumblrStrategy = require('passport-tumblr').Strategy
const session = require('express-session')
const app = require('express')()
const config = require('./config')

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
    function (token, tokenSecret, profile, done) {
      console.log(token)
      console.log(tokenSecret)
      console.log(profile)
      console.log(done)
      process.nextTick(function () {
        return done(null, profile)
      })
    }
  )
)

app.use(
  session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth', passport.authenticate('tumblr'))

app.get(
  '/auth/callback',
  passport.authenticate('tumblr', { failureRedirect: '/' }),
  function (req, res) {
    console.log(req.user)
    // Successful authentication, redirect home.
    res.redirect('/')
  }
)

app.listen(3000)
console.log('Server is listening on http://127.0.0.1:3000')
