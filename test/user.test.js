process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
    db = rr.db,
    testMaker = require("./lib/testmaker"),
    userFixtures = require("./fixtures/users");

// key for creating and retrieving the account
var USER = userFixtures.randomUser();

module.exports = testMaker({
  beforeAll: function(next) {
    db.collection("users").remove()
      .done(function() { rr.dbInitialize(next); });
  },

  afterAll: function(next) {
    db.close(next);
  },

  "tests": {

    "create account with username/password": function(test) {

      test.expect(5);
      
      rr.Users.create(USER, {
        success: function(created_user) {
          test.ok(created_user, "no user created");

          rr.Users.findOne(USER, {
            success: function(found_user) {
              test.ok(found_user, "no user found");

              // both variables must reference the exact same object
              ['username', 'password', '_id'].forEach(function(key) {
                test.equal(found_user.toJSON()[key].toString(),
                           created_user.toJSON()[key].toString());
              });
              test.done();
            } });
        } });
    },

    "try to create duplicate account": function(test) {
      test.expect(3);
      rr.Users.find({ username: USER.username }, {
        success: function(dataview) {
          test.ok(dataview.length == 1, "test user does not exist");
          test.equal(dataview.first().get("username"), USER.username,
                     "find() returned wrong user");

          rr.Users.create({ username: USER.username }, {
            success: function(created_user) {
              test.ok(!created_user, "duplicate user created"); // should fail
              test.done();
            },
            error: function(model, err) {
              test.ok(err, "no error");
              
              test.done();
            }
          });
        }
      });
    },

    "update user": function(test) {
      test.expect(2);
      rr.Users.find({ username: USER.username }, {
        success: function(dv) {
          var user = dv.first();
          test.ok(user, "user doesn't exist");

          user.set({password: "new"});
          user.save(null, {
            success: function(user) {
              test.equal(user.get("password"), "new",
                         "user not updated");
              test.done();
            },
            error: function(model, err) {
              test.ifError(err);
              test.done();
            }
          });
        },
        error: function(dv, err) {
          test.ifError(err);
          test.done();
        }
      });
    },

    "delete user": function(test) {
      test.expect(2);
      rr.Users.find({ username: USER.username }, {
        success: function(dv) {
          var user = dv.first();
          test.ok(user, "User exists");
          
          user.destroy({
            success: function() {

              rr.Users.find({ username: USER.username }, {
                success: function(dv) {
                  test.equal(dv.length, 0, "user still exists");
                  test.done();
                },
                error: function(dv, err) {
                  test.ifError(err);
                  test.done();
                }
              });
            },
            error: function(err) {
              test.ifError(err);
              test.done();
            }
          });
        },
        error: function(dv, err) {
          test.ifError(err);
          test.done();
        }
      });
    }
  }
});
