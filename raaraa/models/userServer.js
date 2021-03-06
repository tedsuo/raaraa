// # UserServer
//
// node.js-only extensions for User model.
//

var MongoStorage = require("../lib/mongo_storage"),
    crypto = require("crypto");

var UserServer = module.exports = [{

// set backend to Mongo
  storage:  new MongoStorage({
              collectionName: "users" 
            })

// instance methods and properties defined here

}, {

// static methods and properties defined here

  signup: function(user_data, cb) {
    var self = this;

    var err = this.validateSignup(user_data);
    if (err) { cb(new Error(err)); return; }

    this.findOne({ username: user_data.username }, function(err, user) {
      if (err) { cb(err); return; };

      if (user) {
        cb(new Error("User already exists"));
        return;
      }
      var new_user_data = {
        username: user_data.username,
        password: self.hashPass(user_data.password)
      };
      self.create(new_user_data, function(err, user) {
        if (err) { cb(err); return; }
        cb(null, user);
      });
    });
  },

  login: function(user_data, cb) {
    var err = this.validateLogin(user_data);
    if (err) { cb(new Error(err)); return; }

    this.findOne(
      { username: user_data.username,
        password: this.hashPass(user_data.password) },
      function(err, user) {
        if (err) { return cb(err); }
        if (!user) {
          return cb(new Error("Bad username or password."));
        }
        cb(null, user);
      }
    );
  },

  hashPass: function(pass) {
    var hash = crypto.createHash('sha256');
    return hash.update("y34s4y3r"+pass).digest("hex");
  }
}];