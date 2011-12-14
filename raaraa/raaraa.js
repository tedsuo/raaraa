process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var models = require('./models'),
    db = require('./db'),
    EventEmitter = require('events').EventEmitter,
    Backbone = require("backbone");

// read library version from package file
 var VERSION = require('../package.json')['version'];

// RaaRaa client
var RaaRaa = function(){
    EventEmitter.call(this);
    this.version = VERSION;
    this.models = models;
    this.db = db;
};

RaaRaa.prototype = {
    createUser: function(doc, callback) {
        this.models.user.create(doc, {
            success: function(model, response) {
                callback(null, response);
            },
            error: function(model, err) {
                callback(err, null);
            }
        });
    },

    findUser: function(query, callback) {
        var m = new this.models.user.model(query);
        m.fetch({
            success: function(model, response) {
                callback(null, response);
            },
            error: function(model, err) {
                callback(err, null);
            }
        });
    },
};

// inherit from EventEmitter
RaaRaa.prototype.__proto__ = EventEmitter.prototype;

// RaaRaa client is a singleton
module.exports = new RaaRaa();