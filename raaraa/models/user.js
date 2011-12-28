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
    defaultQueryParams: { active: 1 },
  },{
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
    },
    hashPass: function(d) { return d; }
  });

  if(server) exports.Users = Users.extend(require("./userServer"));
  else exports.Users = Users;
})(this);