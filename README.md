# Violet for Tumblr

Create `config/local.js`

    $ touch config/local.js

Edit `config/local.js`

    module.exports = {
      TUMBLR_CONSUMER_KEY: 'xxxxxxxxxx',
      TUMBLR_SECRET_KEY: 'xxxxxxxxxx'
    }

Install MongoDB

    $ brew install mongodb

Start DB (with other process)

    $ npm run db

Run

    $ sails lift