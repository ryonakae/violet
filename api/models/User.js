/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  adapter: 'postgres',

  autoCreatedAt: false,
  autoUpdatedAt: false,

  tableName: 'user',

  attributes: {
    username: {
      type: 'string',
      // primaryKey: true,
      unique: true,
      required: true
    },
    provider: 'string',
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

