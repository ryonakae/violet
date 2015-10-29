# Violet for Tumblr

Create `env.js`

    $ touch env.js

Edit `env.js`

    module.exports = {
      TUMBLR_CONSUMER_KEY: 'xxxxxxxxxx',
      TUMBLR_SECRET_KEY: 'xxxxxxxxxx'
    }

Install MongoDB

    $ brew install mongodb

Start DB (with other process)

    $ npm run db

Compile `main.jsx` to `main.js` with Browserify

    $ npm run browserify

Run

    $ npm start