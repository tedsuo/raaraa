process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    express = require('express'),
    socketIO = require('socket.io'),
    routes = require('./routes'),
    rr = require('../raaraa');

var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 9002;

// RaaRaa http and socket.io server
var app = express.createServer();
var io = socketIO.listen(app);
console.log('RaaRaa v'+rr.version+': http and socket.io server');

// export server
module.exports = app;

// setup static http file server
app.use(express.static(__dirname + "/client"));

// setup views
app.set('views', __dirname + '/client/templates');
app.set('view engine', 'jade');

// setup routes
routes.setup(app);
app.use(app.router);

// once we're ready, start taking connections
app.listen(PORT,HOST);
app.host = HOST;
app.port = PORT;

console.log('RaaRaa http service listening on '+app.host+':'+app.port);