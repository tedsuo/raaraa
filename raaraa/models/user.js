var Storage = require("../storage"),
    Collection = require("../raaraa").Collection,
    Model = require("../raaraa").Model,
    server = require("../is-server");

/*    function hash(password) {
      return crypto.createHash("sha1").update("t4stybab1es!"+password)
      .digest('hex');
      }*/

var storage;

if (server) {
    storage = new Storage.MongoStorage("users");
} else {
    storage = new Storage.ClientStorage();
}

var UserModel = Storage.Model.extend({
    storage: storage,
    initialize: function() {
        
    },
});

var UserCollection = Storage.Collection.extend({
    model: UserModel,
    storage: storage,
    initialize: function() {
        
    }
});

module.exports = new UserCollection();

