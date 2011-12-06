var assert = require("assert");

["./user"].forEach(function(file) {
  var module = require(file);
  assert(module.collectionClass !== undefined,
    "Model did not export a collectionClass");
  assert(module.documentClass !== undefined,
    "Model did not export a documentClass");
  assert(module.name, "Model did not export a name");
  exports[module.name] = module;
});
