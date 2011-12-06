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

var raaApp;
module.exports = {
  "test .version": function(test) {
    test.expect(1);
    test.ok(/^\d+\.\d+\.\d+$/.test(raaraa.version), "Invalid version format");
    test.done();
  },
  
  "test new RaaRaa": function(test) {
    test.expect(1);
    raaApp = new raaraa.RaaRaa(db, server, function() {});
    test.ok(raaApp, "RaaRaa app object not instantiated");
    test.done();
  },
  
  "test models loaded": function(test) {
    test.expect(1);
    test.ok(raaApp.models && Object.keys(raaApp.models).length > 0, "Models not loaded");
    test.done();
  },
};
    
