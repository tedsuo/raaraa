var rr = require("../lib/raaraa");

module.exports = {
  "models loaded": function(test) {
    test.ok(rr.models && Object.keys(rr.models).length > 0, "Models not loaded");
    test.done();
  },

  "user model loaded": function(test) {
    test.ok(rr.models.user, "User Model not loaded");
    test.done();
  }
};
    
