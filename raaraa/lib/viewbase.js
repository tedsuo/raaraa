(function() {
  RaaRaa.View = Backbone.View.extend({
    render: function() {
      $(this.el).html(RaaRaa.render(this.template()
                                    , { model: this.model.toJSON() }));
      return this;
    }
  });
})();