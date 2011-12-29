process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
db = rr.db,
h = require("./lib"),
user_fixtures = require("./fixtures/users");


// key for creating and retrieving the account
var USER = user_fixtures.randomUser();

module.exports = h.makeTest({
  beforeAll: function(next) {
    db.collection("users")
      .remove()
      .done(next);
  },

  afterAll: function(next) {
    db.close(next);
  },

  "tests": {

    "create account with username/password": function(test) {

      test.expect(5);
      
      rr.Users.create(USER, function(err, created_user) {
        if (h.checkError(err, test)) return;

        test.ok(created_user, "no user created");

        rr.Users.findOne(USER, function(err, found_user) {
          if (h.checkError(err, test)) return;

          test.ok(found_user, "no user found");

          // both variables must reference the exact same object
          ['username', 'password', '_id'].forEach(function(key) {
            test.equal(found_user.toJSON()[key].toString(),
                       created_user.toJSON()[key].toString());
          });
          test.done();
        });
      });
    },

    "try to create duplicate account": function(test) {
      test.expect(4);
      rr.Users.find({ username: USER.username }, function(err, dataview) {
        if (h.checkError(err, test)) return;

        test.ok(dataview.length == 1, "test user does not exist");
        test.equal(dataview.first().get("username"), USER.username,
                   "find() returned wrong user");

        rr.Users.create(
          { username: USER.username },
          function(err, created_user) {
            test.ok(err, "duplicate user error not thrown");
            test.ok(!created_user, "duplicate user created"); 
            test.done();
          });
      });
    },

    "update user": function(test) {
      test.expect(2);
      rr.Users.find({ username: USER.username }, function(err, dv) {
        if (h.checkError(err, test)) return;

        var user = dv.first();
        test.ok(user, "user doesn't exist");

        user.set({password: "new"});
        user.save(null, function(err, user) {
          if (h.checkError(err, test)) return;

          test.equal(user.get("password"), "new",
                     "user not updated");
          test.done();
        });
      });
    },

    "delete user": function(test) {
      test.expect(2);
      rr.Users.find({ username: USER.username }, function(err, dv) {
        if (h.checkError(err, test)) return;

        var user = dv.first();
        test.ok(user, "User exists");
        
        user.destroy(function(err) {
          if (h.checkError(err, test)) return;

          rr.Users.find({ username: USER.username }, function(err, dv) {
            if (h.checkError(err, test)) return;

            test.equal(dv.length, 0, "user still exists");
            test.done();
          });
        });
      });
    }
  }
});
