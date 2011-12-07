var assert = require("assert");

["./jade"].forEach(function(file) {
  var module = require(file);
  assert(module.configure, "View did not export a configure() function");
  assert(module.render, "View did not export a render() function");
  assert(module.name, "View did not export a name");
  exports[module.name] = module;
});
