process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
    db = rr.db;

// key for creating and retrieving the account
var USER_ID = {
    username: 'test_'+Date.now(),
    password: 'password'
};

var numTestsRun = 0;

function beforeAll(next) {
    if (numTestsRun == 0) {
        db.collection("users").remove()
            .done(function() { rr.dbInitialize(next); });
    } else {
        next();
    }
}

var totalTests;

function afterAll(next) {
    if (numTestsRun >= totalTests) {
        db.close(next);
    } else {
        next();
    }
}

module.exports = {
    setUp: function(next) {
        beforeAll(next);
    },

    tearDown: function(next) {
        numTestsRun++;
        afterAll(next);
    },

"user tests": {

    "create account with username/password": function(test) {

        test.expect(3);
        
        rr.models.user.create(USER_ID, { success: function(created_user) {
            test.ok(created_user, "no user created");

            rr.models.user.findOne(USER_ID, { success: function(found_user) {
                test.ok(found_user, "no user found");

                // both variables must reference the exact same object
                test.deepEqual(created_user.toJSON(), found_user.toJSON());
                test.done();
            } });
        } });
    },

    "try to create duplicate account": function(test) {
        test.expect(3);
        rr.models.user.find({ username: USER_ID.username }, {
            success: function(dataview) {
                test.ok(dataview.length == 1, "test user does not exist");
                test.equal(dataview.first().get("username"), USER_ID.username,
                           "find() returned wrong user");

                debugger;
                rr.models.user.create({ username: USER_ID.username }, {
                    success: function(created_user) {
                        debugger;
                        test.ok(!created_user, "duplicate user created"); // should fail
                        test.done();
                    },
                    error: function(model, err) {
                        debugger;
                        test.ok(err, "no error");
                        
                        test.done();
                    }
                });
            }
        });
    },
}
};

totalTests = Object.keys(module.exports["user tests"]).length;
