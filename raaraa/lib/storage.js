(function(root){
  var is_node = false;

  if (typeof window == 'undefined') {
    is_node = true;
    var Backbone = require("backbone"),
        _ = require("underscore");
  }
  
  
  /*
   * API:DataStorage subclasses needs to provide these methods:
   *
   * query(queryParams, callback)
   * insert(model, callback)
   * update(model, callback)
   * delete(model, callback)
   * var attrsArray = parseDataView(response)
   * var attrsObject = parseModel(response)
   */
  var DataStorage = function(options) {
    this.init(options);
  }

  if(is_node){
    module.exports = DataStorage;
  } else {
    root.DataStorage = DataStorage;
  }

  _.extend(DataStorage.prototype, {
    init: function(options) {
    },

    sync: function(method, model, options) {
      // model here is either a Model or DataView
      var cb = function(err, response) {
        if (err) {
          options.error(err);
        } else {
          options.success(response);
        }
      };

      switch (method) {
      case "read":
        debugger;
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
    },

    query:   function(){ throw 'must be overwritten in sub-class'},
    create: function(){ throw 'must be overwritten in sub-class'},
    update: function(){ throw 'must be overwritten in sub-class'},
    delete: function(){ throw 'must be overwritten in sub-class'}

  });
})(this);