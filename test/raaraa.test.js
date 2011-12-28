process.env.NODE_ENV = 'test';

var rr = require("../raaraa");
var fs = require('fs');

module.exports = {

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
    rr.initialize(function() {
      var expectedModels = ['Users'];
      test.expect(expectedModels.length);
      expectedModels.forEach(function(key) {
        test.ok(rr[key], key+" model not loaded");
      });
      test.done();
    });
  }
};