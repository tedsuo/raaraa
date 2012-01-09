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
  this._ready = false;
  this.version = VERSION;
  this.db = db;
  this.lib_dirname = __dirname+"/";
  this._logged_in_users = {}; // TODO: use redis
  this._initializeModels();
  process.nextTick(function(){
    this._ready = true;
    this.emit('ready');
  }.bind(this));
};

RaaRaa.prototype = {

  onReady: function(cb) {
    if (this._ready) {
      process.nextTick(cb);
    }
    this.on('ready', cb);
  },

  onReadyOnce: function(cb) {
    if (this._ready) {
      process.nextTick(cb);
    } else {
      this.once('ready', cb);
    }
  },

  _initializeModels: function(){
    _.each(models,function(model,model_name){
      this[model_name] = model;
    }.bind(this))
  },

  setUser: function(session_id, user) {
    this._logged_in_users[session_id] = user;
  },

  getUser: function(session_id) {
    return this._logged_in_users[session_id];
  }
};

// inherit from EventEmitter
RaaRaa.prototype.__proto__ = EventEmitter.prototype;

// RaaRaa client is a singleton
var rr = module.exports = new RaaRaa();

rr.on('error', function(e) { console.error(e.toString()) });