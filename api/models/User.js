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
      type: 'STRING',
      unique: true,
      required: true
    },
    provider: 'STRING',
    token: {
      type: 'STRING',
      unique: true,
      required: true
    },
    tokenSecret: {
      type: 'STRING',
      unique: true,
      required: true
    }
  }
};

