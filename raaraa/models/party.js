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



  var Party = Model.extend({
    
  });

  if(server) {
    exports.Party = Party.extend.apply(Party,
                                      require("./partyServer"));
  } else {
    exports.Party = Party;
  }
})(this);