var Storage = {};
    Backbone = require("backbone");
    db = require("./db");
    _ = require("underscore");

var Model = exports.Model = Backbone.Model.extend({
    idAttribute: '_id',
    parse: function() {
        return this.storage.parse.apply(this, arguments);
    },
});

var Collection = exports.Collection = Backbone.Collection.extend({

});


var MongoStorage = exports.MongoStorage = function(collectionName) {
    this.params = {};
    this.collectionName = collectionName;
    this.collection = db.collection(this.collectionName);
};

var _fixupItem = function(item) {
    return item;
}

_.extend(MongoStorage.prototype, {
    find: function(model, cb) {
        this.collection.findOne({ _id: model.id })
            .done(function(item) {
                _fixupItem(item);
                cb(null, item);
            })
            .fail(function(err) {
                cb(err, null);
            });
    },

    findAll: function(queryParams, cb) {
        this.collection.find(queryParams || this.params).toArray()
            .done(function(items) {
                _.each(items, _fixupItem);
                cb(null, items);
            })
            .fail(function(err) {
                cb(err, null);
            });
    },

    create: function(model, cb) {
        this.collection.insert(model.toJSON())
            .done(function(items) {
                cb(null, _fixupItem(items[0]));
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

    parse: function(response) {
        if (response instanceof Array) {
            return response[0];
        } else {
            return response;
        }
    },
});




Backbone.sync = function(method, model, options) {
    var storage = model.storage || model.collection.storage;

    var cb = function(err, response) {
        debugger;
        if (err) {
            options.error(model, response, options);
        } else {
            options.success(response);
        }
    };

    switch (method) {
    case "read":
        model.id ? storage.find(model, cb)
            : storage.findAll(options.queryParams, cb);
        break;

    case "create":
        storage.create(model, cb);
        break;

    case "update":
        storage.update(model, cb);
        break;

    case "delete":
        storage.delete(model, cb);
        break;
    }
}


