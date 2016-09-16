/*
 * Added for Saucelabs
 * https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
 */
var log = [];
var testName;

QUnit.done(function (test_results) {
  var tests = [];
  for(var i = 0, len = log.length; i < len; i++) {
    var details = log[i];
    tests.push({
      name: details.name,
      result: details.result,
      expected: details.expected,
      actual: details.actual,
      source: details.source
    });
  }
  test_results.tests = tests;

  window.global_test_results = test_results;
});
QUnit.testStart(function(testDetails){
  QUnit.log(function(details){
    if (!details.result) {
      details.name = testDetails.name;
      log.push(details);
    }
  });
});

(function($, bp) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module("The Backpack Object");

  test("Backpack funtion returns instance of BackpackJS Object", function() {
    expect(1);

    ok(bp() instanceof bp.Object);
  });

  test("BackpackJS Object is array-like object", function() {
    expect(2);

    notEqual(typeof bp().length, "undefined");
    notEqual(typeof bp().splice, "undefined");
  });

  test("Handles empty values", function() {
    expect(4);

    ok(bp("").length == 0);
    ok(bp(null).length == 0);
    ok(bp(undefined).length == 0);
    ok(bp(false).length == 0);
  });

  test("Pack method is publicly accessible", function() {
    expect(1);

    equal(typeof bp.pack, "function");
  });

  module("Selecting Elements");

  test("Selects by class", function() {
    expect(2);

    var Btest = bp(".js-test");
    var $test = $(".js-test");

    strictEqual(Btest.length, $test.length);
    strictEqual(Btest[0], $test[0]);
  });

  test("Selects by id", function() {
    expect(2);

    var Btest = bp("#js-test-1");
    var $test = $("#js-test-1");

    strictEqual(Btest.length, $test.length);
    strictEqual(Btest[0], $test[0]);
  });

  test("Selects by tag", function() {
    expect(2);

    var Btest = bp("div");
    var $test = $("div");

    strictEqual(Btest.length, $test.length);
    strictEqual(Btest[0], $test[0]);
  });

  test("Selects by element object", function() {
    expect(2);

    var el = document.getElementById("js-test-1");
    var Btest = bp(el);
    var $test = $(el);

    strictEqual(Btest.length, $test.length);
    strictEqual(Btest[0], el);
  });

  test("Selects by array of nodes", function() {
    expect(2);

    var array = [document.getElementById("js-test-1"), document.getElementById("js-test-1")];
    var Btest = bp(array);

    strictEqual(Btest.length, array.length);
    strictEqual(Btest[0], array[0]);
  });

  test("Selects by Nodelist", function() {
    expect(2);

    var nodeList = document.querySelectorAll("js-test");
    var Btest = bp(nodeList);

    strictEqual(Btest.length, nodeList.length);
    strictEqual(Btest[0], nodeList[0]);
  });

  test("Selects by Nodelist", function() {
    expect(2);

    var nodeList = document.querySelectorAll("js-test");
    var Btest = bp(nodeList);

    strictEqual(Btest.length, nodeList.length);
    strictEqual(Btest[0], nodeList[0]);
  });

  module("Method Functionality", {
    setup: function() {
      this.b_els = bp(".js-test");
    }
  });

  test("Added to fn namespace", function() {
    expect(1);

    bp.pack("test", function() {});

    ok(!!bp.fn.test);
  });

  test("Accepts function as pack", function() {
    expect(1);

    bp.pack("test", function() {});

    ok(!!bp.fn.test);
  });

  test("Function runs when namespace is called", function() {
    expect(1);

    bp.pack("test", function() {
      return "good";
    });

    strictEqual(this.b_els.test(), "good");
  });

  test("Arguments are passed", function() {
    expect(1);

    bp.pack("test", function( ret ) {
      return ret;
    });

    strictEqual(this.b_els.test("good"), "good");
  });

  test("`this` is the bp object", function() {
    expect(1);

    bp.pack("test", function() {
      return this;
    });

    strictEqual(this.b_els.test(), this.b_els);
  });

  test("Elements are automatically iterated when autoIterate option is passed", function() {
    expect(2);

    bp.pack("test", function() {
      this.wasIterated = true;
    }, true);
    this.b_els.test()

    ok(this.b_els[0].wasIterated);
    ok(this.b_els[1].wasIterated);
  });

  test("Method is chainable when autoIterate option is passed", function() {
    expect(1);

    bp.pack("test", function() {}, true);


    strictEqual(this.b_els.test(), this.b_els);
  });

}(jQuery, bp));
