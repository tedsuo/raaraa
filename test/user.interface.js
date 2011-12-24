process.env.NODE_ENV = 'test';

var rr = require("../raaraa"),
    server = require("../server"),
    zombie = require('zombie'),
    db = rr.db;

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

  tearDown: function(){
    process.exit();
  },
    
  "sign up from homepage": function(test) {
    test.expect(1);

    // key for creating and retrieving the test account
    var USER_ID = {
        username: 'test_'+Date.now(),
        password: 'password'
    };

    var browser = new zombie.Browser({ 
      site: 'http://'+server.host+':'+server.port
    });

    browser.visit('/', function(e, browser, status) {
      browser
        .fill('#signup-user',USER_ID.username)
        .fill('#signup-pass',USER_ID.password)
        .fill('#signup-verify',USER_ID.password)
        .pressButton('#signup-submit', function(e, browser) {
          // Form submitted, new page loaded.
          test.equal(browser.statusCode, 200);
          test.done();
        });
    });
  }
}