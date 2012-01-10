// #RaaRaa app views
(function() {

  var MainPage = RaaRaa.View.extend({
    el: '#rara-container',

    events: {
      'click #add-party': 'addParty'
    },

    addParty: function(e) {
      var new_party = new RaaRaa.Parties();
      new_party.set({ action: "New"
                      , name: "Party"});

      var party_edit_view = new RaaRaa.views.PartyEditView({
        model: new_party
      });
      
      $('#col-2').append(party_edit_view.render().el);
    },

  });

  RaaRaa.views.MainPage = MainPage;
})();