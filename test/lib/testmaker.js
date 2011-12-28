var _ = require("underscore");

module.exports = function makeTest(options) {
  var testsRun = 0, totalTests = Object.keys(options.tests).length;

  var beforeEach = function(next) {
    if (options.beforeAll && testsRun == 0) {

      options.beforeAll(function() {
        if (options.setUp) {
          options.setUp(next);
        } else {
          next();
        }
      });

    } else {

      if (options.setUp) {
        options.setUp(next);
      } else {
        next();
      }

    }
  };

  var afterEach = function(next) {
    testsRun++;

    if (options.afterAll && testsRun >= totalTests) {

      options.afterAll(function() {
        if (options.tearDown) {
          options.tearDown(next);
        } else {
          next();
        }
      });

    } else {

      if (options.tearDown) {
        options.tearDown(next);
      } else {
        next();
      }

    }
  };

  var nodeunitTests = {};
  _.extend(nodeunitTests,
           options.tests,
           {
             setUp: beforeEach,
             tearDown: afterEach,
           });

  return nodeunitTests;
}
