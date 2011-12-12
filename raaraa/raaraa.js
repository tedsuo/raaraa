process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    models = require('./models'),
    mongoose = require('mongoose'),
    EventEmitter = require('events').EventEmitter;

// read library version from package file
var VERSION = JSON.parse(require("fs").readFileSync(require("path").join(__dirname, '..', 'package.json'), 'utf8'))['version'];;

// RaaRaa client
var RaaRaa = function(){
    EventEmitter.call(this);
    this.version = VERSION;
    this.models = models;
};

RaaRaa.prototype = {
    createUser: function(doc, callback) {
        this.models.user.createUser(doc, callback);
    },

    findUser: function(query, callback) {
        this.models.user.findUser(query, callback);
    },
};

// inherit from EventEmitter
RaaRaa.prototype.__proto__ = EventEmitter.prototype;

// RaaRaa client is a singleton
module.exports = new RaaRaa();