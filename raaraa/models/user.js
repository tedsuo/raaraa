// #User
(function(root) {
  var Model, server = false, exports;

  if (typeof window == 'undefined') {
    server = true;
    Model = require("../lib/modelbase").Model;
    exports = module.exports;
  } else {
    Model = root.RaaRaa.Model;
    exports = root.RaaRaa || (root.RaaRaa = {});
  }

  var Users = Model.extend({
    defaults: {
      active: true
    }
  },{
    defaultQueryParams: {
      active: true
    },

    signup: function(user_data, cb) {
      var self = this;

      if (user_data.password != user_data.verify) {
        cb(new Error("Passwords do not match"));
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
          password: Users.hashPass(user_data.password)
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
            return cb(new Error("Username or password does not match"));
          }
          cb(null, user);
        }
      );
    },

    hashPass: function(d) { return d; }
  });

  if(server) exports.Users = Users.extend(require("./userServer"));
  else exports.Users = Users;
})(this);