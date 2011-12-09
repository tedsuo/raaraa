["user"].forEach(function(name) {
  exports[name] = require("./"+name);
});