var assert = require("assert");

["./main"].forEach(function(file) {
  var module = require(file);
  assert(module.routes, "Controller did not export any routes");
  assert(module.name, "Controller did not export a Name");
  exports[module.name] = module;
});
