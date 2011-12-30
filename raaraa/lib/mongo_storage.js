var DataStorage = require('./storage'),
_ = require("underscore"),
db = require("../db"),
BSON = require("mongoq").BSON;

var MongoStorage = module.exports = function MongoStorage(options) {
  DataStorage.apply(this, arguments);
};

var fixupID = function(model) {
  var id = model.id;
  if (!(id instanceof BSON.ObjectID)) {
    id = BSON.ObjectID(id);
  }
  return id;
}

_.extend(MongoStorage.prototype, DataStorage.prototype, {
  init: function(options) {
    DataStorage.prototype.init.call(this, options);
    this.collectionName = options.collectionName;
    this.collection = db.collection(this.collectionName);
  },

  query: function(queryParams, cb) {
    if (queryParams._id) {
      queryParams._id = fixupID({ id: queryParams._id });
    }
    this.collection.find(queryParams).toArray()
      .done(function(items) {
        cb(null, items);
      })
      .fail(function(err) {
        cb(err, null);
      });
  },

  insert: function(model, cb) {
    this.collection.insert(model.toJSON(), { safe: true })
      .done(function(item) {
        cb(null, item);
      })
      .fail(function(err) {
        cb(err, null);
      });
  },

  update: function(model, cb) {
    this.collection.update({ _id: fixupID(model) },
                           model.toJSON(),
                           { safe: true })
      .done(function() {
        cb(null, model.toJSON());
      })
      .fail(function(err) {
        cb(err, null);
      });
  },

  delete: function(model, cb) {
    this.collection.remove({ _id: fixupID(model) })
      .done(function() {
        cb(null, null);
      })
      .fail(function(err) {
        cb(err, null);
      });
  },

  parseModel: function(response) {
    if (response instanceof Array) {
      return response[0];
    } else {
      return response;
    }
  },

  parseDataView: function(response) {
    if (response instanceof Array) {
      return response;
    } else {
      return [response];
    }
  },
});

MongoStorage.prototype.__proto__ = DataStorage.prototype;

