var mongoq = require('mongoq'),
config = require('../config')[process.env.NODE_ENV || 'development'];

// setup RaaRaa mongodb connection
var connectUrl = process.env.MONGO_CONNECT ||
    "mongodb://"+config.db_host+":"+config.db_port+"/"+config.db_name;

var db = module.exports = mongoq(connectUrl);

// ##Users
//
// username key is unique
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
// name:user_id key is unique
//
db.ensureIndex(
  "parties", 
  { name: 1, user_id: 1 }, 
  { unique: true },
  function(err) {
    if(err) throw err;
  }
);