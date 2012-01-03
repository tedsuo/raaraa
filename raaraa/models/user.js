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

    hashPass: function(d) { return d; }
  });

  if(server) {
    exports.Users = Users.extend.apply(Users,
                                      require("./userServer"));
  } else {
    exports.Users = Users;
  }
})(this);