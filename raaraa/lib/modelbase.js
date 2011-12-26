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
     * options: { success: function(model),
     *            error: function(error) }
     */
    create: function(attrs, options) {
      var self = this;
      var model = new this(attrs);

      model.bind("error", function(model, err, options) {
        self.emit("error", model, err, options);
      });

      model.save(null, {
        success: function(model) {
          options.success(model);
        },
        error: function(model, err) {
          options.error(model, err);
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
      var dvType = exports.DataView.extend({ model: this });
      var dv = new dvType();

      dv.storage = this.prototype.storage;
      dv.queryParams = _.extend({}, this.defaultQueryParams || {}, query);

      dv.bind("error", function(model, err, options) {
        self.emit("error", model, err, options);
      });

      dv.fetch({
        success: function(dv) {
          options.success(dv);
        },
        error: function(dv, error) {
          options.error(dv, error);
        }
      });
      return dv;
    },

    /* 
     * options: { success: function(model),
     *            error: function(error) }
     */
    findOne: function(query, options) {
      return this.find(query, {
        success: function(dv) {
          var model = dv.first();
          options.success(model);
        },
        error: function(dv, error) {
          options.error(dv, error);
        }
      });
    },
  });

  exports.DataView = Backbone.Collection.extend({
    queryParams: {},
    parse: function() {
      return this.storage.parseDataView.apply(this, arguments);
    },
    export: function(data) {
      
    },
    import: function(data) {

    }
  });

  Backbone.sync = function(method, model, options) {
    var storage = model.storage || model.model.storage;
    storage.sync.apply(storage, arguments);
  }

})(this);
