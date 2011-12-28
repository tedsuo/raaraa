var MongoStorage = require("../lib/mongo_storage");

module.exports = {

  storage: new MongoStorage({ collectionName: "users" })


}