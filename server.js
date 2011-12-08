var
    config = require("./config"),
    express = require('express'),
    raaraa = require('./lib/RaaRaa');

console.log('RaaRaa v'+raaraa.version);

var app = express.createServer();

// set up ENV with the DB connection variables
process.env.MONGO_CONNECT = process.env.MONGO_CONNECT
    || "mongodb://"+config.db_host+":"+config.db_port+"/"+config.db_name;

var models = require('./lib/models');
    controllers = require('./lib/controllers');

var rr = new raaraa.RaaRaa(models);

app.configure(express.logger(),
	      express.bodyParser(),
              
              // Attach our RaaRaa object to each request
              function(req, res, next) {
	          req.rr = rr;
	          next();
              },

	      express.static(__dirname + "/public"));


app.listen(9002);

console.log('RaaRaa listening on port 9002');

