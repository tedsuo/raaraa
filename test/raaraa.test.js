process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
fs = require('fs'),
h = require('./lib');

module.exports = h.makeTest({
  beforeAll: function(next) {
    rr.onReadyOnce(next);
  },
  
  afterAll: function(next) {
    rr.db.close();
    next();
  },

  "tests": {
    "RaaRaa exists": function(test) {
      test.expect(1);
      test.ok(rr, "RaaRaa app object not instantiated");
      test.done();
    },
    
    ".version": function(test) {
      test.expect(1);
      test.ok(/^\d+\.\d+\.\d+$/.test(rr.version), "Invalid version format");
      test.done();
    },
    
    "RaaRaa#lib_dirname points to valid directory": function(test) {
      test.expect(2);
      test.equal( typeof rr.lib_dirname, 'string');
      fs.stat(rr.lib_dirname,function(err,stats){
        if(err){
          test.ifError(err);
        } else {
          test.ok(stats.isDirectory(), rr.lib_dirname+" is not a directory");
        }
        test.done();
      });
    },

    "models loaded": function(test) {
      var expectedModels = ['Users','Parties'];
      test.expect(expectedModels.length);
      expectedModels.forEach(function(key) {
        test.ok(rr[key], key+" model not loaded");
      });
      test.done();
    },

    "ready callbacks fired": function(test) {
      test.expect(2);
      rr.onReady(function() {
        test.ok(true);
        rr.onReadyOnce(function() {
          test.ok(true);
          test.done();
        });
      });
    },
  }
});