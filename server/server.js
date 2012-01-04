process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require("../config")[process.env.NODE_ENV],
    express = require('express'),
    socketIO = require('socket.io'),
    routes = require('./routes'),
    static_server = require('./static.js')
    rr = require('../raaraa');


var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 9002;

// RaaRaa http and socket.io server
var app = express.createServer();
var io = socketIO.listen(app);

console.info('RaaRaa v'+rr.version+': http and socket.io server');

// export server
module.exports = app;

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

  io.sockets.on("connection", function(client) {
    console.log("starting session handshake");
    client.emit("get session");
    client.on("set session", function(session_id) {
      // TODO set unique session ID when logging in,
      // write rr.getUser() and rr.setUser()
      console.log("got session id " + session_id);
      var user = rr.getUser(session_id);
      client.set("session", session_id, function() {
        if (user) {

          console.log("sending user");

          client.emit("current user", user.toJSON());
        } else {
          console.log("error, no user");

          client.emit("error", "User is not logged in, should not be setting up a socket");
        }
      });
    });
  });

  console.info('RaaRaa http service listening on '+app.host+':'+app.port);
});

rr.on('error', function(e) { console.error(e.toString()) });

app.on("error", function(e) { console.error(e.message); });

app.on("close", function() {
  io.server.close();
  console.warn('RaaRaa http service stopped listening on '+app.host+':'+app.port) 
});