(function(root) {
  var _, server = false, Backbone, uuid, exports;
  if (typeof window == 'undefined') {
    server = true;
  }

  if (server) {
    _ = require("underscore");
    Backbone = require("backbone");
    exports = root;
  } else {
    _ = root._;
    Backbone = root.Backbone;
    exports = root.RaaRaa || (root.RaaRaa = {});
  }
  
  exports.models = {};

  exports.Model = Backbone.Model.extend({
    idAttribute: '_id',
    parse: function() {
      var storage = (this.storage || this.collection.storage);
      return storage.parseModel.apply(this, arguments);
    },
    import: function(data) {

    },
    export: function(data) {

    }
  }, {
    /* 
     */
    create: function(attrs, callback) {
      var self = this;
      var model = new this(attrs);

      model.bind("error", function(model, err, options) {
        self.emit("error", model, err, options);
      });

      model.save(null, callback);

      return model;
    },

    /* 
     */
    find: function(query, callback) {
      var self = this;
      var dvType = exports.DataView.extend({ model: this });
      var dv = new dvType();

      dv.storage = this.prototype.storage;
      dv.queryParams = _.extend({}, this.defaultQueryParams || {}, query);

      dv.bind("error", function(model, err, options) {
        self.emit("error", model, err, options);
      });

      dv.fetch(callback);
      return dv;
    },

    /* 
     * 
     */
    findOne: function(query, callback) {
      return this.find(query, function(err, dv) {
        if (err) {
          callback(err);
          return;
        }
        
        var model = dv.first();
        callback(null, model);
      });
    },
  });

  ['save', 'destroy', 'fetch'].forEach(function(method) {
    exports.Model.prototype[method] = function() {
      var args = _.toArray(arguments);
      var callback = args.pop();
      args.push({ 
        success: function(model) {
          callback(null, model);
        },
        error: function(model, err) {
          callback(err);
        }
      });
      return Backbone.Model.prototype[method].apply(this, args);
    };
  });

  exports.DataView = Backbone.Collection.extend({
    queryParams: {},
    parse: function() {
      return this.storage.parseDataView.apply(this, arguments);
    },
    export: function(data) {
      
    },
    import: function(data) {

    },

    fetch: function(callback) {
      var options = {
        success: function(model) {
          callback(null, model);
        },
        error: function(model, err) {
          callback(err);
        }
      };

      return Backbone.Collection.prototype.fetch.call(this, options);
    },
  });




  Backbone.sync = function(method, model, options) {
    var storage = model.storage || model.model.storage;
    storage.sync.apply(storage, arguments);
  }

})(this);
