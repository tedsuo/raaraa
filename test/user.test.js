process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
    db = rr.db;

module.exports = {
    setUp: function(next) {
        db.collection("users").remove().done(function(){
            next();
        });
    },
    
    "create account with username/password": function(test) {
        
        test.expect(5);
        
        // key for creating and retrieving the account
        var USER_ID = {
            username: 'test_'+Date.now(),
            password: 'password'
        };

        // create a new user with username and password combo
        rr.createUser( USER_ID, function(err,created_user){
            test.ok(err === null, err);
            test.ok(created_user, "no user created");

            // try to find the user with the same combo
            rr.findUser( USER_ID, function(err,found_user) {
                test.ok(err === null, err);
                test.ok(found_user, "no user found");

                // both variables must reference the exact same object
                test.deepEqual(created_user, found_user);
                test.done();
            });
        });
    },

    tearDown: function(next) {
        db.close(next);
    }
};
