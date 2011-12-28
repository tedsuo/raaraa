var mongoq = require('mongoq'),
config = require('../config')[process.env.NODE_ENV || 'development'];

// setup RaaRaa mongodb connection
var connectUrl = process.env.MONGO_CONNECT ||
    "mongodb://"+config.db_host+":"+config.db_port+"/"+config.db_name;

module.exports = mongoq(connectUrl);
