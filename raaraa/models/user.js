(function(root) {
  var Model, server = false, Storage;
  
  if (typeof window == 'undefined') {
    server = true;
  }

  if (server) {
    Model = require("../lib/modelbase").Model;
    MongoStorage = require("../lib/mongo_storage");
    RaaRaa = require("../raaraa");
  } else {
    Model = root.RaaRaa.Model;
    RaaRaa = root.RaaRaa || (root.RaaRaa = {});
  }

  /*    function hash(password) {
        return crypto.createHash("sha1").update("t4stybab1es!"+password)
        .digest('hex');
        }*/

  var storage;
  if (server) {
    storage = new MongoStorage({ collectionName: "users" });
  }

  RaaRaa.Users = Model.extend({
    storage: storage,
    defaultQueryParams: { active: 1 },
    initialize: function() {
//      this.storage = storage;
    },
  });

  

})(this);