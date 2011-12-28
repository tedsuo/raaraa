process.env.NODE_ENV = 'test';

var db = require("../raaraa").db,
  server = require("../server"),
  zombie = require('zombie'),
  userFixtures = require("./fixtures/users"),
  testMaker = require("./lib/testmaker");

var USER = userFixtures.randomUser();

var _browser = new zombie.Browser({
  site: 'http://'+server.host+':'+server.port,
  debug: true,
});

function getBrowser() {
  return _browser;
}

module.exports = testMaker({
  beforeAll: function(next) {
    db.collection("users")
      .remove()
      .done(function(){
        next();
      })
      .fail(function(err) {
        throw new Error(err);
      });
  },

  afterAll: function(next) {
    server.close();
    db.close(next);
  },

  tests: {

    "hit homepage": function(test) {
      test.expect(1);

      var browser = getBrowser();

      browser.visit('/', function(e, browser) {
        test.ok(browser.success, "Failed to load homepage");
        test.done();
      });
    },
    
    "sign up from homepage": function(test) {
      test.expect(2);
      
      var browser = getBrowser();

      browser
        .fill('#signup-user',USER.username)
        .fill('#signup-pass',USER.password)
        .fill('#signup-verify',USER.password)
        .pressButton('#signup-submit', function(e, browser) {
          // Form submitted, new page loaded.
          test.ok(browser.success, "Error code returned");
          if (browser.error) {
            test.ifError(browser.error);
          } else {
            test.ok(browser.html("#accountOptions"),
                    "User account panel not loaded");
          }
          test.done();
        });
    }
  }
});

