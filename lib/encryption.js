var crypto = require('crypto');
var config = require('../config');

var encryption = {
  encrypt: function(data){
    var cipher = crypto.createCipher("aes-256-cbc",config.encryption_key);
    var ret_val = "";
    ret_val += cipher.update(data, "utf8", "hex");
    return ret_val + cipher.final("hex");
  },
  decrypt: function(data){
    var cipher = crypto.createDecipher("aes-256-cbc",config.encryption_key);
    var ret_val = "";
    ret_val += cipher.update(data, "hex", "utf8");
    return ret_val + cipher.final("utf8");
  }
};

module.exports = encryption;
