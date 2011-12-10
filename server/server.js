process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    express = require('express'),
    socketIO = require('socket.io'),
    routes = require('./routes'),
    rr = require('../raaraa');

// RaaRaa http server
var app = express.createServer();
console.log('RaaRaa v'+rr.version+': HTTP SERVER');

// setup static http file server
app.use(express.static(__dirname + "/client"));

// setup views
app.set('views', __dirname + '/client/templates');
app.set('view engine', 'jade');

// setup routes
routes.setup(app);
app.use(app.router);

// RaaRaa socket.io server
var io = socketIO.listen(app);

// once we're ready, start taking connections
app.listen(9002);
console.log('RaaRaa http service listening on port 9002');