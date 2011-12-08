var config = require("../config"),
    raaraa = require("../lib/raaraa"),
    test_utils = require("./lib/utils");

// set up test database
test_utils.createDBConnectUrl("raaraa_test");

var models = require("../lib/models");

var raaApp = new raaraa.RaaRaa(models);

module.exports = {
  "test .version": function(test) {
    test.expect(1);
    test.ok(/^\d+\.\d+\.\d+$/.test(raaraa.version), "Invalid version format");
    test.done();
  },
  
  "test new RaaRaa": function(test) {
    test.expect(1);
    test.ok(raaApp, "RaaRaa app object not instantiated");
    test.done();
  },
  
  "test models loaded": function(test) {
    test.expect(1);
    test.ok(raaApp.models && Object.keys(raaApp.models).length > 0, "Models not loaded");
    test.done();
  },
};
    
