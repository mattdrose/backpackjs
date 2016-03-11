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

  module("Plugin Functionality", {
    // This will run before each test in this module.
    setup: function() {
      this.b_el1 = bp("#js-test-1");
      this.b_el2 = bp("#js-test-2");
      this.b_els = bp(".js-test");

      bp.pack("test", {});
    }
  });

  test("Added to fn namespace", function() {
    expect(1);

    ok(!!bp.fn.test);
  });

  test("Chainable", function() {
    expect(1);

    strictEqual(this.b_els.test(), this.b_els);
  });

  test("Plugin cached in elements object as \"bp-{pluginName}\"", function() {
    expect(1);

    this.b_el1.test();
    ok(!!this.b_el1[0]["bp-test"]);
  });

  test("Plugin applied to each element in a group", function() {
    expect(1);

    var isOk = true;

    this.b_els.test();

    $.each(this.b_els, function(i, el){
      if (!el["bp-test"]) {
        isOk = false;
      }
    });

    ok(isOk);

  });

  test("Each instance of plugin is separate", function() {
    expect(1);

    this.b_els.test();

    notStrictEqual(this.b_el1[0]["bp-test"], this.b_el2[0]["bp-test"]);

  });

  module("Plugin Caching Dom Objects", {
    // This will run before each test in this module.
    setup: function() {
      this.b_el = bp("#js-test-1");

      bp.pack("test", {});
    },
    teardown: function() {
      this.b_el.unpack("test");
    }
  });

  test("Dom element is cached", function() {
    expect(2);

    this.b_el.test();

    strictEqual(this.b_el[0], this.b_el[0]["bp-test"].$el[0]);
    strictEqual(this.b_el[0], this.b_el[0]["bp-test"].el);
  });

  test("Original selector is cached", function() {
    expect(1);

    this.b_el.test();

    strictEqual(this.b_el[0]["bp-test"]._selector, "#js-test-1");
  });
  module("Plugin Methods and Variables", {
    // This will run before each test in this module.
    setup: function() {
      this.b_el = bp("<div/>");

      bp.pack("test", {
        pub: "public",
        _private: true,
        exclaim: function(input) {
          return input + "!";
        },
        getThis: function() {
          return this;
        },
        setText: function(val) {
          this.el.innerHTML = val;
        }
      });

      this.b_el.test();
    },
    teardown: function() {
      this.b_el.unpack("test");
    }
  });

  test("Plugin object gives access to passed objects", function() {
    expect(2);

    strictEqual(this.b_el[0]["bp-test"].pub, "public");
    strictEqual(this.b_el[0]["bp-test"].exclaim("itemTwo"), "itemTwo!");
  });

  test("Easily set public variables", function() {
    expect(1);

    this.b_el.test("pub", "foo");

    strictEqual(this.b_el[0]["bp-test"].pub, "foo");
  });

  test("\"this\" gives context to plugin within method", function() {
    expect(1);

    strictEqual(this.b_el[0]["bp-test"].getThis(), this.b_el[0]["bp-test"]);
  });

  test("Easily call methods", function() {
    expect(1);

    this.b_el.test("setText", "Hello World!");

    strictEqual(this.b_el[0].innerHTML, "Hello World!");
  });

  module("Plugin Settings", {
    // This will run before each test in this module.
    setup: function() {
      this.b_el = bp("#js-test-1");

      bp.pack("test", {
        defaults: {
          one: "1",
          two: "2",
          three: "3"
        },
        data: ["one"]
      });
    },
    teardown: function() {
      this.b_el.unpack("test");
    }
  });

  test("Defaults are cached", function() {
    expect(1);

    this.b_el.test();

    deepEqual(this.b_el[0]["bp-test"].defaults, {
      one: "1",
      two: "2",
      three: "3"
    });
  });

  test("Data attributes are cached", function() {
    expect(1);

    this.b_el.test();

    deepEqual(this.b_el[0]["bp-test"].data, {
      one: "ONE"
    });
  });

  test("User options are cached", function() {
    expect(1);

    this.b_el.test({
      foo: "bar"
    });

    deepEqual(this.b_el[0]["bp-test"].options, {
      foo: "bar"
    });
  });

  test("Settings properly give priority to data > options > defaults", function() {
    expect(1);

    this.b_el.test({
      one: "one",
      two: "two"
    });

    deepEqual(this.b_el[0]["bp-test"].settings, {
      one: "ONE",
      two: "two",
      three: "3"
    });
  });

  module("Method Functionality", {
    setup: function() {
      this.b_els = bp(".js-test");
    }
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
