process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
    db = rr.db;

module.exports = {
    setUp: function(next) {
        db.collection("users").remove()
            .done(function(){
                next();
            })
            .fail(function(err) {
                throw new Error(err);
            });
    },
    
    "create account with username/password": function(test) {

        test.expect(3);
        
        // key for creating and retrieving the account
        var USER_ID = {
            username: 'test_'+Date.now(),
            password: 'password'
        };

        rr.models.user.on("error", function(model, err) {
            test.ifError(err);
        });

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

    tearDown: function(next) {
        db.close(next);
    }
};
