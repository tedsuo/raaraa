process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    models = require('./models'),
    mongoose = require('mongoose'),
    EventEmitter = require('events').EventEmitter;

var VERSION = '0.0.1';

// setup RaaRaa mongodb connection
process.env.MONGO_CONNECT = process.env.MONGO_CONNECT ||
    "mongodb://"+config.db_host+":"+config.db_port+"/"+config.db_name;

var db = mongoose.connect(process.env.MONGO_CONNECT).connection;

// RaaRaa client
var RaaRaa = function(){
  this.version = VERSION;
  this.models = models;
};

// inherit from EventEmitter
RaaRaa.prototype.__proto__ = EventEmitter.prototype;


// RaaRaa client is a singleton
module.exports = new RaaRaa();