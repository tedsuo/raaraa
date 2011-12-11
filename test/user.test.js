process.env.NODE_ENV = 'test';

var rr = require("../raaraa");

module.exports = {
  
  "create account with username/password": function(test) {
  
    test.expect(1);
    
    // key for creating and retrieving the account
    var USER_ID = {
      name: 'test_'+Date.now(),
      password: 'password'
    };

    // create a new user with username and password combo
    rr.createUser( USER_ID, function(err,created_user){
      if(err) throw err;

      // try to find the user with the same combo
      rr.findUser( USER_ID, function(err,found_user) {
        if(err) throw err;

        // both variables must reference the exact same object
        test.equals(created_user,found_user);
        test.done();  
      });
    });
  },
};