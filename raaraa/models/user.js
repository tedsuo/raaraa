(function(root) {
  var Model, server = false, storage;
  
  if (typeof window == 'undefined') {
    server = true;
  }

  if (server) {
    Model = require("../lib/modelbase").Model;
    MongoStorage = require("../lib/mongo_storage");
    RaaRaa = require("../raaraa");
    storage = new MongoStorage({ collectionName: "users" });
  } else {
    Model = root.RaaRaa.Model;
    RaaRaa = root.RaaRaa || (root.RaaRaa = {});
  }

  RaaRaa.Users = Model.extend({
    storage: storage,
    defaultQueryParams: { active: 1 },
    initialize: function() {

    }
  });

  

})(this);