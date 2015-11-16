/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  adapter: (process.env.NODE_ENV === 'production') ? 'productionPostgresqlServer' : 'somePostgresqlServer',

  attributes: {
    username: {
      type: 'text',
      unique: true,
      required: true
    },
    provider: 'text',
    token: {
      type: 'text',
      unique: true,
      required: true
    },
    tokenSecret: {
      type: 'text',
      unique: true,
      required: true
    }
  }
};

