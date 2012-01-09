// test mode
process.env.NODE_ENV = 'test';

// ### requires

var rr = require("../raaraa"),
    db,
    h = require("./lib"),
    user_fixtures = require("./fixtures/users");

// ### constants
// key for creating and retrieving the account
var USER, PARTY;
var setupFixtures = function(next){
  rr.Users.create(
    user_fixtures.randomUser(),
    function( err, user){
      if (err) throw err;

      USER = user;
      PARTY = {
        name: 'test_party_'+Date.now(),
        owner_id: user.id
      }

      next();
    }
  );
};

module.exports = h.makeTest({
  beforeAll: function(next) {
    rr.onReadyOnce(function() {
      db = rr.db;
      setupFixtures(next);
    });
  },

  setUp: function(next){
    db.collection("parties")
      .remove()
      .done(function(err){
        if(err) throw err;
        next();
      });
  },

  afterAll: function(next) {
    db.close();
    next();
  },

  "tests": {

    "user can create a party": function(test) {

      test.expect(2);

      rr.Party.create(PARTY
        , function(err, party){
          if (h.checkError(err, test)) return;

          test.ok(party, "no party created");

          test.equal( 
            party.get("name"), 
            PARTY.name,
            "party not updated"
          );

          test.done();
        }
      );
    },

    "user cannot create duplicate party": function(test) {
      test.expect(3);

      rr.Party.create(
        PARTY,
        function(err, party) {
          if (h.checkError(err, test)) return;

          test.equal( 
            party.get("name"), 
            PARTY.name,
            "find() returned wrong party"
          );

          rr.Party.create(
            PARTY,
            function(err, party) {
              test.ok(err, "expected duplicate party error to be thrown");
              test.ok(!party, "duplicate should not have been created"); 
              test.done();
            }
          );
        }
      );

    },

    "user can update party": function(test) {
      test.expect(2);
      
      rr.Party.create(
        PARTY,
        function(err, party) {
          if (h.checkError(err, test)) return;
          test.ok(party, "party doesn't exist");

          var new_name = "test_new_name"+Date.now();

          party.save( 
            {name: new_name}, 
            function(err, party) {
              if(h.checkError(err, test)) return;

              test.equal( party.get("name"), 
                          new_name,
                         "party not updated");

              test.done();
            }
          );

        }
      );
    },

    "user can delete party": function(test) {
      test.expect(1);
      rr.Party.create(
        PARTY,
        function(err, party) {
          if (h.checkError(err, test)) return;
          
          party.destroy(function(err) {
            if (h.checkError(err, test)) return;

            rr.Party.find(
              PARTY,
              function(err, parties) {
                if (h.checkError(err, test)) return;

                test.equal(parties.length, 0, "party still exists");
                test.done();
              }
            );
          });
        }
      );
    }
  }
});
