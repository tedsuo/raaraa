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

var raaApp = new raaraa.RaaRaa(db, server);
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
  
  "test controllers loaded": function(test) {
    test.expect(1);
    test.ok(raaApp.controllers && Object.keys(raaApp.controllers).length > 0, "Models not loaded");
    test.done();
  },
  
  "test views loaded": function(test) {
    test.expect(1);
    test.ok(raaApp.views && Object.keys(raaApp.views).length > 0, "Models not loaded");
    test.done();
  },
};
    
