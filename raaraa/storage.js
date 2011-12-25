var Storage = {};
    Backbone = require("backbone");
    db = require("./db");
    EventEmitter = require('events').EventEmitter,
    _ = require("underscore");

/*
 * A DataStorage subclass needs to provide these methods:
 *
 * query(queryParams, callback)
 * insert(model, callback)
 * update(model, callback)
 * delete(model, callback)
 * var attrsArray = parseDataView(response)
 * var attrsObject = parseModel(response)
 */
var DataStorage = function DataStorage(options) {
    EventEmitter.apply(this);
    this.init(options);
}

_.extend(DataStorage.prototype, {
    init: function(options) {
    },

    sync: function(method, model, options) {
        // model here is either a Model or DataView
        var cb = function(err, response) {
            if (err) {
                options.error(model, err, options);
            } else {
                options.success(response);
            }
        };

        switch (method) {
        case "read":
            var query = model.id ? model.toJSON() : model.queryParams;
            this.query(query, cb);
            break;

        case "create":
            this.insert(model, cb);
            break;

        case "update":
            this.update(model, cb);
            break;

        case "delete":
            this.delete(model, cb);
            break;
        }
    }
});

DataStorage.prototype.__proto__ = EventEmitter.prototype;

var MongoStorage = exports.MongoStorage = function MongoStorage(options) {
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

