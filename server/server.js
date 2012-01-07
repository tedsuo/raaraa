process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    express = require('express'),
    routes = require('./routes'),
    static_server = require('./static.js')
    rr = require('../raaraa');


var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 9002;

// RaaRaa http server
var app = module.exports = express.createServer();

console.info('RaaRaa v'+rr.version+': http and socket.io server');

// setup static http file server
static_server.setup(app);

// setup views
app.set('views', __dirname + '/../templates');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

// setup routes
routes.setup(app);
app.use(app.router);

rr.on('ready',function(){
  // once we're ready, start taking connections
  app.listen(PORT,HOST);
  app.host = HOST;
  app.port = PORT;
  console.info('RaaRaa http service listening on '+app.host+':'+app.port);
});

app.on("error", function(e) { console.error(e.message); });

app.on("close", function() {
  console.warn('RaaRaa http service stopped listening on '+app.host+':'+app.port) 
});