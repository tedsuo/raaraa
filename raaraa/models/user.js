(function(root) {
  var Model, server = false, storage, hashPass;
  
  if (typeof window == 'undefined') {
    server = true;
  }

  if (server) {
    Model = require("../lib/modelbase").Model;
    MongoStorage = require("../lib/mongo_storage");
    RaaRaa = require("../raaraa");
    storage = new MongoStorage({ collectionName: "users" });
    hashPass = require("./userServer").hashPass;
  } else {
    Model = root.RaaRaa.Model;
    RaaRaa = root.RaaRaa || (root.RaaRaa = {});
    hashPass = function(d) { return d; };
  }

  RaaRaa.Users = Model.extend({
    storage: storage,
    defaultQueryParams: { active: 1 },
    initialize: function() {

    },

    signup: function(userData, cb) {
      this.findOne({ username: userData.username }, {
        success: function(user) {
          cb("User already exists");
        },
        error: function() {
          var newUserData;
          newUserData.username = userData.username;
          newUserData.password = hashPass(userData.password);
          this.create(newUserData, {
            success: function(user) {
              user.set("password", '');
              cb(null, user);
            },
            error: function(model, err) {
              cb(err);
            }
          });
        }
      });
    }
  });

  

})(this);