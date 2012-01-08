process.env.NODE_ENV = 'test';

var db = require("../raaraa").db,
server = require("../server"),
zombie = require('zombie'),
user_fixtures = require("./fixtures/users"),
testMaker = require("./lib/testmaker");

var sign_up_user = user_fixtures.randomUser();

var _last_browser;
function createBrowser() {
  _last_browser = new zombie.Browser({
    site: 'http://'+server.host+':'+server.port,
    debug: false
  });
  return _last_browser;
}

function lastBrowser() {
  return _last_browser;
}

function signUp(user, browser, cb) {
  browser.visit('/', function(e, browser) {
    browser
      .fill('#signup-user',user.username)
      .fill('#signup-pass',user.password)
      .fill('#signup-verify',user.password_verify || user.password)
      .pressButton('#signup-submit', function(e, browser) {
        _last_browser = browser;
        cb(e, browser);
      });
  });
}

function logIn(user, browser, cb) {
  browser.visit('/', function(e, browser) {
    browser
      .fill('#signin-user',user.username)
      .fill('#signin-pass',user.password)
      .pressButton('#signin-submit', cb);
  });
}

module.exports = testMaker({
  beforeAll: function(next) {
    server.onReadyOnce(function() {
      db.collection("users")
        .remove()
        .done(function(){
          next();
        })
        .fail(function(err) {
          throw new Error(err);
        });
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
    
    "sign up duplicate user": function(test) {
      test.expect(1);

      var user = user_fixtures.randomUser();
      db.collection("users").insert(user).done(function(user) {
        var browser = createBrowser();
        signUp(user, browser, function(e, browser) {
          test.equal(browser.text("#errors"),
                     "Error: User already exists");
          test.done();
        });
      });
    },

    "sign up form not valid": function(test) {
      test.expect(1);

      var user = user_fixtures.randomUser();
      user.password_verify = 'asdf';
      var browser = createBrowser();

      signUp(user, browser, function(e, browser) {
          test.equal(browser.text("#errors"),
                     "Error: The passwords you entered do not "
                     + "match. Please try again.");
          test.done();
      });
    },

    "sign up from homepage": function(test) {
      test.expect(3);
      
      var browser = createBrowser();

      signUp(sign_up_user, browser, function(e, browser) {
        // Form submitted, new page loaded.
        test.ok(browser.success,
                browser.statusCode+" Error: "+browser.html());

        if (browser.error) {
          test.ifError(browser.error);
          return test.done();
        }

        test.ok(!browser.html("#signup"),
                "We should not be seeing the login page");

        browser.wait(
          function(window) {
            return browser.html("#logout-btn");
          }, function() {
            test.ok(browser.html("#logout-btn"),
                    "We should be seeing a logout button");
            test.done();
          }
        );
      });
    },

    "log out": function(test) {
      test.expect(3);

      lastBrowser().visit('/', function(e, browser) {
        browser.wait(
          function(window) {
            return browser.html("#logout-btn");
          }, function() {
            if (!browser.html("#logout-btn")) {
              test.ok(browser.html("#logout-btn"),
                      "Logout button not detected!");
              return test.done();
            }

            browser.clickLink("#logout-btn", function(e, browser) {
              test.ok(browser.success,
                      browser.statusCode+" Error: "+browser.html());

              if(browser.error) {
                test.ifError(browser.error);
                return test.done();
              }

              test.ok(browser.html("#signup"),
                      "We should be seeing the login page");
              test.ok(!browser.html("#logout-btn"),
                      "We should not be seeing a logout button");
              test.done();
            });
          }
        );
      });
    },

    "log in": function(test) {
      test.expect(4);

      logIn(sign_up_user, createBrowser(), function(e, browser) {
        test.ok(browser.success,
                browser.statusCode+" Error: "+browser.html());

        if(browser.error) {
          test.ifError(browser.error);
          return test.done();
        }

        test.ok(!browser.html("#signup"),
                "We should not be seeing the login page");
        browser.wait(
          function(window) {
            return browser.html("#logout-btn");
          }, function() {
            test.ok(browser.html("#logout-btn"),
                    "We should be seeing a logout button");
            test.equal(browser.text("#header-account .name"),
                       sign_up_user.username,
                       "We should be seeing the current user icon");

            test.done();
          }
        );
      });
    },

    "log in with bad password": function(test) {
      test.expect(3);

      logIn({ username: sign_up_user.username,
              password: 'WRONG' }, createBrowser(), function(e, browser) {
        test.ok(browser.success,
                browser.statusCode+" Error: "+browser.html());

        if(browser.error) {
          test.ifError(browser.error);
          return test.done();
        }

        test.ok(browser.html("#signup"),
                "We should be seeing the login page");
        test.ok(!browser.html("#logout-btn"),
                "We should not be seeing a logout button");
        test.done();
      });
    },

  }
});

