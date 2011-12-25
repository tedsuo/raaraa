process.env.NODE_ENV = 'test';

var rr = require("../raaraa");

module.exports = {
  "models loaded": function(test) {
    var expectedModels = ['Users'];
    test.expect(expectedModels.length);
    expectedModels.forEach(function(key) {
      test.ok(rr[key], key+" model not loaded");
    });
    test.done();
  },
};
    
