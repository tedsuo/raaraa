var
  config = require("../config"),
  fs = require("fs")
  raaraa = require("../lib/raaraa"),
  mongo = require("mongodb"),
  express = require("express");

// set up test database
var db = new mongo.Db('raaraa_test',
                      new mongo.Server(config.db_host, config.db_port, {}),
                      {});
var server = express.createServer(express.logger(), express.bodyParser());

var rr = new raaraa.RaaRaa(db, server);

module.exports = {
    "test model doesn't exist": function(test) {
	test.expect(1);
	test.throws(function() { var badModel = rr.getModel("XXX"); });
	test.done();
    },

    "test fetch collection class": function(test) {
	test.expect(1);
	debugger;
	var userModel = rr.getModel("User");
	test.ok(userModel, "No collection class returned");
	test.done();
    },
};
    
