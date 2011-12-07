/*!
 * RaaRaa
 */

/**
 * Module dependencies
 */
var config = require("../config"),
    fs = require("fs")
    express = require("express");

exports.version = '0.0.1';

function RaaRaa(db, server) {
    this.init(db, server);
};

RaaRaa.prototype = {
    // init(db, callback)
    // sets up models, views, contollers
    init: function(db, server) {
	this.stash = {};
	this.models = {};
	this.views = {};
	this.controllers = {};

	this.db = db;
	this.server = server;

	this.loadModels();
	this.loadViews();
	this.loadControllers();
	
	this.configure();

	this.registerRoutes();
    },
    
    
    /*
     * configure()
     * Do configuration phase of startup. Configure Express server, model, views,
     * and controllers
     */
    configure: function() {
	var self = this;
	[ express.logger(),
	  express.bodyParser(),
	  this.handleRequest.bind(this),
	  express.static(__dirname + "/public"), ]
            .forEach(function(middleware) {
		self.server.use(middleware);
            });

	Object.keys(this.views).forEach(function(name) {
            var view = this.views[name];
            view.configure(this);
        }.bind(this));
    },
    
    handleRequest: function(req, res, next) {
	req.rr = this;
	next();
    },
    
    /*
     * loadModels()
     * Loads model modules from the lib/models/ directory
     */
    loadModels: function() {
	// load from files
	this._modelModules = require("./models");

	Object.keys(this._modelModules).forEach(function(i) {
	    var model = this._modelModules[i];
	    model.rr = this;
	    
	    this.models[model.name] = model;
	}.bind(this));
    },

    /*
     * getModel(name)
     * Returns the collection object for the model named 'name'
     */
    getModel: function(name) {
	var model = this.models[name];
	if (model === undefined) {
	    throw new Error("No such model " + name);
	}

	return model;
    },
    
    /*
     * loadViews()
     * Load view modules from disk.
     */
    loadViews: function() {
	this._viewModules = require("./views");

	Object.keys(this._viewModules).forEach(function(i) {
	    var view = this._viewModules[i];
	    view.rr = this;

	    this.views[view.name] = view;
	}.bind(this));
    },

    getView: function(name) {
	var view = this.views[name];
	if (view === undefined) {
	    throw new Error("No such view " + name);
	}

	return view;
    },
    
    /*
     * renderView(name, ...)
     * Render View named 'name' with the passed arguments
     */
    renderView: function(name, req, res, template, options, callback) {
	var view = this.getView(name);
	return view.render(this, req, res, template, options, callback);
    },
    
    /*
     * loadControllers()
     * Load controller modules from disk and register routes
     */
    loadControllers: function() {
	this._controllerModules = require("./controllers");

	Object.keys(this._controllerModules).forEach(function(i) {
	    var controller = this._controllerModules[i];
	    controller.rr = this;

	    this.controllers[controller.name] = controller;
	}.bind(this));
    },

    getController: function(name) {
	var controller = this.controllers[name];
	if (controller === undefined) {
	    throw new Error("No such controller " + name);
	}

	return controller;
    },
    
    /*
     * registerRoutes()
     * Registers all Controllers' routes. Routes are exports of the Controller
     * module formatted as arguments to Express.get().
     *
     * // In some Controller module
     * export.routes = [
     *   [ '/user/:id', middlewareFunc, function(req, res) { } ],
     *   ...
     * ];
     */
    registerRoutes: function() {
	Object.keys(this.controllers).forEach(function(name) {
	    var controller = this.controllers[name];
	    if (controller.routes) {
		var self = this;
		controller.routes.forEach(function(routeArgs) {
		    self.server.get.apply(self.server, routeArgs);
		});
	    }
	}.bind(this));
    },
    
};

exports.RaaRaa = RaaRaa;



