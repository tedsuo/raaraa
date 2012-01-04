// #User view
(function() {

  var UserBadgeView = RaaRaa.View.extend({
    events: {
      "click .small-profile-pic": "test"
    },

    test: function() {
      alert(this.model.get("username"));
    }
  });

  RaaRaa.views.UserBadgeView = UserBadgeView;
})();