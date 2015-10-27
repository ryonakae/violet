# Violet for Tumblr

    $ cd app
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

Run

    $ npm start