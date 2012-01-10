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

    hashPass: function(d) { return d; },

    validateSignup: function(user_data) {
      if (user_data.password != user_data.verify) {
        return "The passwords you entered do not match. Please try again.";
      }

      if (user_data.username == '' || user_data.username === undefined) {
        return "Please enter a username";
      }

      if (user_data.password == '' || user_data.password === undefined) {
        return "Please enter a password";
      }

      return;
    },

    validateLogin: function(user_data) {
      if (user_data.username == '' || user_data.username === undefined) {
        return "Please enter a username";
      }

      if (user_data.password == '' || user_data.password === undefined) {
        return "Please enter a password";
      }

      return;
    },

  });

  if(server) {
    exports.Users = Users.extend.apply(Users,
                                      require("./userServer"));
  } else {
    exports.Users = Users;
  }
})(this);