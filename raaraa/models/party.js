// #Party
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



  var Parties = Model.extend({
    
  });

  if(server) {
    exports.Parties = Parties.extend.apply(Parties,
                                           require("./partyServer"));
  } else {
    exports.Parties = Parties;
  }
})(this);