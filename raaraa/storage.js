var Storage = {};
    Backbone = require("backbone");
    db = require("./db");
    EventEmitter = require('events').EventEmitter,
    _ = require("underscore");

var Model = exports.Model = Backbone.Model.extend({
    idAttribute: '_id',
    parse: function() {
        return this.storage.parseModel.apply(this, arguments);
    },
});

var DataView = exports.DataView = Backbone.Collection.extend({
    queryParams: {},
    parse: function() {
        return this.storage.parseDataView.apply(this, arguments);
    }
});

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
        this.model = options.model;
    },

    /* 
     * options: { success: function(model),
     *            error: function(error) }
     */
    create: function(attrs, options) {
        var self = this;
        var model = new this.model(attrs);

        model.storage = this;

        model.bind("error", function(model, err, options) {
            self.emit("error", model, err, options);
        });

        model.save(null, {
            success: function(model) {
                options.success(model);
            },
            error: function(model, err) {
                options.error(err);
            }
        });
        return model;
    },

    /* 
     * options: { success: function(dataview),
     *            error: function(error) }
     */
    find: function(query, options) {
        var self = this;
        var dv = new DataView();

        dv.storage = this;
        dv.queryParams = query;

        dv.bind("error", function(model, err, options) {
            self.emit("error", model, err, options);
        });

        dv.fetch({
            success: function(dv) {
                options.success(dv);
            },
            error: function(dv, error) {
                options.error(error);
            }
        });
        return dv;
    },

    /* 
     * options: { success: function(model),
     *            error: function(error) }
     */
    findOne: function(query, options) {
        var self = this;
        var dv = new DataView();

        dv.storage = this;
        dv.queryParams = query;

        dv.bind("error", function(model, err, options) {
            self.emit("error", model, err, options);
        });

        dv.fetch({
            success: function(dv) {
                var model = dv.first();
                options.success(model);
            },
            error: function(dv, error) {
                options.error(error);
            }
        });
    },

    sync: function(method, model, options) {
        // model here is either a Model or DataView
        var cb = function(err, response) {
            if (err) {
                options.error(model, response, options);
            } else {
                options.success(response);
            }
        };

        switch (method) {
        case "read":
            var query = model.id ? model.toJSON() : model.queryParam;
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
        this.collection.insert(model.toJSON())
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


Backbone.sync = function(method, model, options) {
    var storage = model.storage || model.collection.storage;
    storage.sync.apply(storage, arguments);
}


