// ### Requires
var MongoStorage = require("../lib/mongo_storage");

// # PartyServer
//
// node.js-only extensions for Party model.
//
var partyServer = module.exports = [{

    storage:  new MongoStorage({ 
                collectionName: "parties" 
              }),
    
    // instance methods and properties defined here

  }, {

    // static methods and properties defined here

  }
];