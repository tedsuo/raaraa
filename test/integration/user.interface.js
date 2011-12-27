process.env.NODE_ENV = 'test';

var db = require("../../raaraa").db,
    server = require("../../server"),
    zombie = require('zombie');


module.exports = {
  setUp: function(next) {
    db.collection("users")
      .remove()
      .done(function(){
        next();
      })
      .fail(function(err) {
        throw new Error(err);
      });
  },

  tearDown: function(next){
    db.close();
    server.close();
    next();
  },
    
  "sign up from homepage": function(test) {
    test.expect(1);
    
    // key for creating and retrieving the test account
    var USERNAME = 'test_'+Date.now(),
        PASSWORD = 'password';

    var browser = new zombie.Browser({ 
      site: 'http://'+server.host+':'+server.port
    });

    browser.visit('/', function(e, browser, status) {
      browser
        .fill('#signup-user',USERNAME)
        .fill('#signup-pass',PASSWORD)
        .fill('#signup-verify',PASSWORD)
        .pressButton('#signup-submit', function(e, browser) {
          // Form submitted, new page loaded.
          test.equal(browser.statusCode, 200);
          test.done();
        });
    });
  }
}