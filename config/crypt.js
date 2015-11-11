module.exports.crypt = {
  crypto: require('crypto'),
  secretKey: (process.env.NODE_ENV === 'production') ? process.env.SECRET_KEY : 'some_random_secret',

  encrypt: function(target){
    var cipher = this.crypto.createCipher('aes-256-ctr', this.secretKey);
    var crypted = Buffer.concat([ cipher.update(new Buffer(target, 'utf8')), cipher.final() ]);
    return crypted.toString('base64');
  },

  decrypt: function(target){
    var decipher = this.crypto.createDecipher('aes-256-ctr', this.secretKey);
    var decrypted = Buffer.concat([ decipher.update(new Buffer(target, 'base64')), decipher.final() ]);
    return decrypted.toString('utf8');
  }
};