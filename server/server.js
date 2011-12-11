process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    express = require('express'),
    socketIO = require('socket.io'),
    routes = require('./routes'),
    rr = require('../raaraa');

// RaaRaa http and socket.io server
var app = express.createServer();
var io = socketIO.listen(app);
console.log('RaaRaa v'+rr.version+': http and socket.io server');

// setup static http file server
app.use(express.static(__dirname + "/client"));

// setup views
app.set('views', __dirname + '/client/templates');
app.set('view engine', 'jade');

// setup routes
routes.setup(app);
app.use(app.router);

// once we're ready, start taking connections
app.listen(9002);
console.log('RaaRaa http service listening on port 9002');