var DataStorage = require('./storage'),
    _ = require("underscore"),
    db = require("../db");
    
    console.log(DataStorage);
    
var MongoStorage = module.exports = function MongoStorage(options) {
    DataStorage.apply(this, arguments);
};

_.extend(MongoStorage.prototype, DataStorage.prototype, {
    init: function(options) {
        DataStorage.prototype.init.call(this, options);
        this.collectionName = options.collectionName;
        this.collection = db.collection(this.collectionName);
    },

    query: function(queryParams, cb) {
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
        this.collection.update({ _id: model.id },
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
        this.collection.remove({ _id: model.id })
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

