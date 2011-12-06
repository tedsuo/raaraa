var assert = require("assert");

[].forEach(function(file) {
  var module = require(file);
  assert(module.Class, "Controller did not export a Class");
  assert(module.Name, "Controller did not export a Name");
  exports[module.Name] = module;
});
