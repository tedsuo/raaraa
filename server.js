process.env.MODE = process.env.MODE || 'development';

var config = require("./config")[process.env.MODE],
    express = require('express'),
    rr = require('./lib/RaaRaa');

// RaaRaa http server
var app = express.createServer();
console.log('RaaRaa v'+rr.version+': HTTP SERVER');

// static file server
app.use(express.static(__dirname + "/client"));

// middleware stacks
var standard_stack = [
  express.logger(),
  express.bodyParser()
];

var streaming_stack = [
  express.logger()
];

// ROUTES
app.get('/', standard_stack, function(req,res){
  res.render("index.jade", { title: 'RaaRaa -- Party People' });
});

app.get('/stream', standard_stack, function(req,res){
  res.render("stream.jade", { title: 'RaaRaa -- My Stream' });
});

app.post('/img', streaming_stack, function(req,res){
  // upload a photo
});

// once we're ready, start taking connections
app.listen(9002);
console.log('RaaRaa http service listening on port 9002');