var socketIO = require('socket.io'),
    server = require('./server.js'),
    rr = require('../raaraa');

var io = socketIO.listen(server);

io.sockets.on("connection", function(client) {
  console.log("starting session handshake");
  
  client.emit("get session");

  client.on("set session", function(session_id) {

    // TODO set unique session ID when logging in,
    // write rr.getUser() and rr.setUser()
    console.log("got session id " + session_id);

    rr.getUser(session_id, function(user) {
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
});
