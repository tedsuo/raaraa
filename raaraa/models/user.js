var Storage = require("../storage"),
    Model = require("../raaraa").Model,
    server = require("../is-server");

/*    function hash(password) {
      return crypto.createHash("sha1").update("t4stybab1es!"+password)
      .digest('hex');
      }*/

var storage;

var UserModel = Storage.Model.extend({
    initialize: function() {
        
    },
});

if (server) {
    storage = new Storage.MongoStorage({ collectionName: "users",
                                         model: UserModel });
} else {
    storage = new Storage.ClientStorage({ model: UserModel });
}


module.exports = storage;

