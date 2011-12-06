/*!
 * RaaRaa
 */
 
/**
 * Module dependencies
 */
var config = require("../config"),
    fs = require("fs");

exports.version = '0.0.1';

var RaaRaa = function(db, server, callback) {
    this.init(db, server, callback);
};

RaaRaa.prototype = {
  // init(db, callback)
  // sets up models, views, contollers
  init: function(db, server, callback) {
    this.stash = {};
    this.models = {};
    this.views = {};
    this.controllers = {};
    
    this.loadModels();
    this.loadViews();
    this.loadControllers();

    this.db = db;
    this.server = server;
    
    this.setupModels();
    this.setupViews();
    this.setupControllers();
    callback();
  },
  
  loadModels: function() {
    // load from files
    this._modelModules = require("./models");
  },

  setupModels: function() {    
    for (var i in this._modelModules) {
      if (!this._modelModules.hasOwnProperty(i))
        continue;

      var model = this._modelModules[i];
      model.app = this;
      
      this.models[model.name] = model;
    }
  },

  loadViews: function() {
    this._viewModules = require("./views");
  },
  
  setupViews: function() {
    for (var i in this._viewModules) {
      if (!this._viewModules.hasOwnProperty(i))
        continue;

      var view = this._viewModules[i];
      view.app = this;

      this.views[view.name] = view;
    }
  },
  
  loadControllers: function() {
    this._controllerModules = require("./controllers");
  },
  
  setupControllers: function() {
    // instantiate controller classes
    for (var i in this._controllerModules) {
      if (!this._controllerModules.hasOwnProperty(i))
        continue;

      var controller = this._controllerModule[i];
      controller.app = this;

      this.controllers[controller.name] = controller;
      
      controller.registerRoutes(this);
    }
  },
  
};

exports.RaaRaa = RaaRaa;

    
  
  