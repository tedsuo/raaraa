process.env.NODE_ENV = 'test';

var db = require("../raaraa").db,
  server = require("../server"),
  zombie = require('zombie'),
  userFixtures = require("./fixtures/users"),
  testMaker = require("./lib/testmaker");

function createBrowser() {
  return new zombie.Browser({
    site: 'http://'+server.host+':'+server.port,
    debug: true
  });
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

      var browser = createBrowser();

      browser.visit('/', function(e, browser) {
        test.ok(browser.success, "Failed to load homepage");
        test.done();
      });
    },
    
    "sign up from homepage": function(test) {
      test.expect(3);
      
      var user = userFixtures.randomUser();
      var browser = createBrowser();
      browser.visit('/', function(e, browser) {
        test.ok(browser.success, "Failed to load homepage");
        browser
          .fill('#signup-user',user.username)
          .fill('#signup-pass',user.password)
          .fill('#signup-verify',user.password)
          .pressButton('#signup-submit', function(e, browser) {

            // Form submitted, new page loaded.
            test.ok(browser.success,
                      browser.statusCode+" Error: "+browser.html());
            if (browser.error) {
              test.ifError(browser.error);
            } else {
              test.ok(!browser.html("#signup"),
                        "We should not be seeing the login page");
              test.ok(browser.html("#logout-btn"),
                        "We should be seeing a logout button");
            }
            test.done();
          });
      });
    }
  }
});

