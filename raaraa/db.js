var mongoq = require('mongoq'),
config = require('../config')[process.env.NODE_ENV || 'development'];
async = require('async');

// setup RaaRaa mongodb connection
var connectUrl = process.env.MONGO_CONNECT ||
  "mongodb://"+config.db_host+":"+config.db_port+"/"+config.db_name;

var db;

module.exports = {
  getDb: function(next) {
    if (db) {
      next(db);
    }
    db = mongoq(connectUrl);

    async.series(
      [
        // ##Users
        //
        // username key is unique
        //
        function(cb) {
          db.ensureIndex(
            "users", 
            { username: 1 }, 
            { unique: true },
            function(err) {
              cb(err);
            }
          );
        },
        function(cb) {
          db.ensureIndex(
            "users", 
            { username: 1 , password: 1 },
            function(err) {
              cb(err);
            }
          );
        },

        // ##Party
        //
        // name:user_id key is unique
        //
        function(cb) {
          db.ensureIndex(
            "parties", 
            { name: 1, user_id: 1 }, 
            { unique: true },
            function(err) {
              cb(err);
            }
          );
        },
      ],

      // callback to report errors during DB startup
      function(err) {
        if (err) throw err;
        next(db);
      }
    );
  }
};
