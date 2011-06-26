var config = require("./config");
var express = require('express');

var app = express.createServer(express.logger(), express.bodyParser());

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/stream/?', function(req, res){
  res.render('stream.jade');
});

app.configure(function(){
  app.use(express.static(__dirname + '/client/'));
  app.use(express.cookieParser());
  app.use(express.session({secret: config.session_secret}));
});

app.listen(9002);

console.log('RaaRaa listening on port 9002');
