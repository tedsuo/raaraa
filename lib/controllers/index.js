var
    assert = require("assert"),
    _ = require("underscore");

var controllers = {};

["./main"].forEach(function(file) {
  var module = require(file);
  assert(module.registerRoutes,
         "Controller did not export a registerRoutes function");
  assert(module.name, "Controller did not export a Name");
  controllers[module.name] = module;
});

/**
 * Returns the specified controller. Throws and error if it doesn't exist.
 * @method getController
 * @param name {String} name of controller
 */
exports.getController = function getController(name) {
    var controller = controllers[name];
    if (controller === undefined) {
	throw new Error("No such controller " + name);
    }

    return controller;
};

/**
 * Hands the Express server to all controller modules' registerRoutes()
 * functions, so they can set up whatever routing they see fit.
 * @method registerRoutes
 * @param app {Express} the Express server to route
 * @param rr {RaaRaa} the RaaRaa object
 */
exports.registerRoutes = function registerRoutes(app, rr) {
    _.each(controllers, function(controller, name) {
        controller.registerRoutes(app, rr);
    });
};
