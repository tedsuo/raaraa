process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var models = require('./models'),
    db = require('./db'),
    EventEmitter = require('events').EventEmitter,
    Backbone = require("backbone");

// read library version from package file
 var VERSION = require('../package.json')['version'];

// RaaRaa client
var RaaRaa = function RaaRaa(){
    EventEmitter.call(this);
    this.version = VERSION;
    this.models = models;
    this.db = db;
    this.lib_dirname = __dirname + '/lib';
};

RaaRaa.prototype = {
    dbInitialize: function(cb) {
        db.ensureIndex("users", { username: 1 }, { unique: true },
                       function(err) {
                           if (err) {
                               throw new Error(err);
                           } else {
                               cb();
                           }
                       });
    }
};

// inherit from EventEmitter
RaaRaa.prototype.__proto__ = EventEmitter.prototype;

// RaaRaa client is a singleton
module.exports = new RaaRaa();