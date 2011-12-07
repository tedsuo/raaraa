var
    config = require("./config"),
    express = require('express'),
    mongo = require('mongodb'),
    fs = require('fs'),
    encryption = require('./lib/encryption'),
    raaraa = require('./lib/RaaRaa');

console.log('RaaRaa v'+raaraa.version);

var server = express.createServer();

var db = new mongo.Db(config.db_name,
		      new mongo.Server(config.db_host, config.db_port, {}),
		      {});

var rr = new raaraa.RaaRaa(db, server);

server.listen(9002);

console.log('RaaRaa listening on port 9002');

/*
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
  var params = JSON.parse(encryption.decrypt(req.params.info));
  var timestamp = new Date().getTime();
  if(timestamp - params.timestamp < 86400000){
    var image_path_split = params.image_path.split('.');
    var filetype = image_path_split[image_path_split.length - 1];
    switch(filetype){
      case "jpg":
      case "png":
        res.writeHead(200,{"Content-Type" : "image/" + filetype});
        var file_handler = fs.createReadStream("./" + params.image_path, {
          flags: "r",
          encoding: 'binary',
          mode: 0666,
          bufferSize: 4 * 1024
        });
        file_handler.addListener("data", function(chunk){
          res.write(chunk, 'binary');
        });
        file_handler.addListener("end", function(){
          res.end();
        });
        break;
      default:
        res.writeHead(404,{"Content-Type" : "text/html"});
        res.write('Image is of an invalid format.');
        res.end();
        break;
    }
  } else {
    res.writeHead(200,{"Content-Type" : "text/html"});
    res.write("Permission invalid to access file.");
    res.end();
  }
});

app.configure(function(){
  app.use(express.static(__dirname + '/client/'));
  app.use(express.cookieParser());
  app.use(express.session({secret: config.session_secret}));
});
*/

