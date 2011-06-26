var config = require("./config");
var express = require('express');
var encryption = require('./lib/encryption');

var app = express.createServer(express.logger(), express.bodyParser());

app.get('/', function(req, res){
  res.render('index.jade');
});

app.get('/stream/?', function(req, res){
  res.render('stream.jade');
});

app.get('/imagerequest/?', function(req, res){
  res.writeHead(200,{"Content-Type" : "text/html"});
  var image_path = "images/example-1.jpg";
  var timestamp = new Date().getTime();
  res.write(encryption.encrypt(JSON.stringify({
    image_path : image_path,
    timestamp : timestamp})));
  res.end();
});

app.get('/imagerender/:info', function(req, res){
  res.writeHead(200,{"Content-Type" : "text/html"});
  res.write(encryption.decrypt(req.params.info));
  res.end();
});

app.configure(function(){
  app.use(express.static(__dirname + '/client/'));
  app.use(express.cookieParser());
  app.use(express.session({secret: config.session_secret}));
});

app.listen(9002);

console.log('RaaRaa listening on port 9002');
