/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  adapter: 'mongo',

  attributes: {
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    provider: 'string',
    token: {
      type: 'string',
      unique: true,
      required: true
    },
    tokenSecret: {
      type: 'string',
      unique: true,
      required: true
    }
  }
};

