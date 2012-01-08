var mongoq = require('mongoq'),
config = require('../config')[process.env.NODE_ENV || 'development'];

// setup RaaRaa mongodb connection
var connectUrl = process.env.MONGO_CONNECT ||
    "mongodb://"+config.db_host+":"+config.db_port+"/"+config.db_name;

var db = module.exports = mongoq(connectUrl);

// ##Users
//
// usernames are unique
//
db.ensureIndex(
  "users", 
  { username: 1 }, 
  { unique: true },
  function(err) {
    if(err) throw err;
  }
);
db.ensureIndex(
  "users", 
  { username: 1 , password: 1 },
  function(err) {
    if(err) throw err;
  }
);
// ##Party
//
// usernames are unique
//
db.ensureIndex(
  "parties", 
  { username: 1 }, 
  { unique: true },
  function(err) {
    if(err) throw err;
  }
);