var assert = require("assert");

[].forEach(function(file) {
  var module = require(file);
  assert(module.Class, "View did not export a Class");
  assert(module.Name, "View did not export a Name");
  exports[module.Name] = module;
});
