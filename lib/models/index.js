var assert = require("assert");

["./user"].forEach(function(file) {
  var module = require(file);
  assert(module.Class, "Model did not export a collection class");
  assert(module.name, "Model did not export a name");
  exports[module.name] = module;
});
