// # UserServer
//
// node.js-only extensions for User model.
//

var MongoStorage = require("../lib/mongo_storage"),
crypto = require("crypto");

module.exports = [{
  // instance methods and properties defined here
  storage: new MongoStorage({ collectionName: "users" })
}, {
  // static methods and properties defined here
  signup: function(user_data, cb) {
    var self = this;

    if (user_data.password != user_data.verify) {
      cb(new Error("The passwords you entered do not match. Please try again."));
      return;
    }

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