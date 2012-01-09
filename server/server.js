process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    HttpServer = require('./lib/http_server').HttpServer,
    routes = require('./routes'),
    static_server = require('./static.js')
    rr = require('../raaraa');

// RaaRaa http server
var app = module.exports = new HttpServer();
app.host = process.env.HOST || 'localhost';
app.port = process.env.PORT || 9002;

console.info('RaaRaa v'+rr.version+': http and socket.io server');

// setup static http file server
static_server.setup(app);

// setup views
app.set('views', __dirname + '/../templates');
app.set('view engine', 'jade');
app.set('view options', { layout: false });

// setup routes
routes.setup(app);

// once we're ready, start taking connections
rr.onReady(function(){
  app.listen(app.port,app.host);
  console.info('RaaRaa http service listening on '+app.host+':'+app.port);
});

app.on("error", function(e) { console.error(e.message); });

app.on("close", function() {
  console.warn('RaaRaa http service stopped listening on '+app.host+':'+app.port) 
});