process.env.MODE = 'test';

var rr = require("../lib/raaraa");

module.exports = {
  ".version": function(test) {
    test.expect(1);
    test.ok(/^\d+\.\d+\.\d+$/.test(rr.version), "Invalid version format");
    test.done();
  },
  
  "RaaRaa exists": function(test) {
    test.expect(1);
    test.ok(rr, "RaaRaa app object not instantiated");
    test.done();
  }
};