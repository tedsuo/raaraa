var assert = require("assert"),
    mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_CONNECT);

var modules = {};

["./user"].forEach(function(file) {
    var module = require(file);
    assert(module.Schema, "Model did not export a Schema");
    assert(module.name, "Model did not export a name");

    // create the model
    module.Model = mongoose.model(module.name, module.Schema);
    modules[module.name] = module;
});


/**
 * Returns the model or throws an error if it doesn't exist. Every model has
 * the format:
 *
 *    model.Schema - mongoose Schema class
 *    model.Model - mongoose Model class
 *    model.name - name
 *
 * @param name {String} name of model
 */
exports.getModel = function getModel(name) {
    var model = modules[name];
    if (model === undefined) {
	throw new Error("No such model " + name);
    }

    return model;
};