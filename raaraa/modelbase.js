(function(root) {
    var _, server = false, Backbone, uuid, RaaRaa;
    if (typeof window === undefined) {
        server = true;
    }

    if (server) {
        _ = require("_");
        Backbone = require("backbone");
        uuid = require("node-uuid");
        RaaRaa = root;
    } else {
        _ = root._;
        Backbone = root.Backbone;
        RaaRaa = root.RaaRaa || (root.RaaRaa = {});
    }
    
    RaaRaa.models = {};

    RaaRaa.Model = Backbone.Model.extend({
        idAttribute: '_id',
        parse: function() {
            var storage = (this.storage || this.collection.storage);
            return storage.parseModel.apply(this, arguments);
        },
        import: function(data) {

        },
        export: function(data) {

        },
        register: function() {
            var self = this;
            if (server && !this.id) {
                this.set({_id: uuid()});
            }
            if (this.id && RaaRaa.models[this.id])
                RaaRaa.models[this.id] = this;

            this.bind("change:id", function(model) {
                RaaRaa.models[model.id] = self;
            });
            
        }
    });

    RaaRaa.DataView = Backbone.Collection.extend({
        queryParams: {},
        parse: function() {
            return this.storage.parseDataView.apply(this, arguments);
        },
        export: function(data) {
            
        },
        import: function(data) {

        }
    });
})(this);
