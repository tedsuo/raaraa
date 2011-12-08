var
    raaraa = require("../lib/raaraa"),
    test_utils = require("./lib/utils");

// set up test database
test_utils.createDBConnectUrl("raaraa_test");

var models = require("../lib/models");

var rr = new raaraa.RaaRaa(models);

module.exports = {
    "test fetch model": function(test) {
	test.expect(1);
	debugger;
	var userModel = rr.models.getModel("User");
	test.ok(userModel, "No collection class returned");
	test.done();
    },

    "test model doesn't exist": function(test) {
	test.expect(1);
	test.throws(function() { var badModel = rr.models.getModel("XXX"); });
	test.done();
    },

};
    
