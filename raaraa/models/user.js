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
  },{
    defaultQueryParams: { active: 1 },

    signup: function(user_data, cb) {
      var self = this;
      this.findOne({ username: user_data.username }, function(err, user) {
        debugger;
        if (err) { cb(err); return; };

        if (user) {
          cb(new Error("User already exists"));
          return;
        }
        var new_user_data = {};
        new_user_data.username = user_data.username;
        new_user_data.password = Users.hashPass(user_data.password);
        self.create(new_user_data, function(err, user) {
          debugger;
          if (err) { cb(err); return; }
          cb(null, user);
        });
      });
    },
    hashPass: function(d) { return d; }
  });

  if(server) exports.Users = Users.extend(require("./userServer"));
  else exports.Users = Users;
})(this);