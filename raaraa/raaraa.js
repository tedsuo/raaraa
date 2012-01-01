process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = require('./db'),
    models = require("./models"),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore'),
    Backbone = require("backbone");


// read library version from package file
var VERSION = require('../package.json')['version'];

// RaaRaa client
var RaaRaa = function RaaRaa(){
  EventEmitter.call(this);
  this.version = VERSION;
  this.db = db;
  this.lib_dirname = __dirname+"/";
  this._initializeModels();
  this._dbInitialize(function(err){
    if(err){
      this.emit('error',err);
      return;
    }
    this.emit('ready');
  }.bind(this));
};

RaaRaa.prototype = {

  _initializeModels: function(){
    _.each(models,function(model,model_name){
      this[model_name] = model;
    }.bind(this))
  },

  _dbInitialize: function(cb) {
    db.ensureIndex(
      "users", 
      { username: 1 }, 
      { unique: true },
      function(err) {
        cb(err);
      }
    );
  },
};

// inherit from EventEmitter
RaaRaa.prototype.__proto__ = EventEmitter.prototype;

// RaaRaa client is a singleton
module.exports = new RaaRaa();

