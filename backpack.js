(function (factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    window.BackpackJS = window.backpack = window.bp = factory();
  }

})(function () {

  'use strict';

  var bp = function(selector) {
    return new bp.Object( selector );
  };

  /**
   * Built-in helpers
   */
  // HTML parser
  bp.htmlParser = new DOMParser();

  // Whether argument is an array or array-like object of node objects
  bp.areNodes = function(nodes) {
    return typeof nodes === 'object' &&
      nodes.hasOwnProperty('length') &&
      (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
  };

  // Whether object is array, or array like
  // http://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like
  bp.isArrayLike = function(obj) {
    return (
      Array.isArray(obj) ||
      (!!obj &&
        typeof obj === "object" &&
        typeof (obj.length) === "number" &&
        (obj.length === 0 ||
          (obj.length > 0 &&
          (obj.length - 1) in obj)
        )
      )
    );
  };

  // Iterate through arrays, array-likes, and objects
  bp.each = function(obj, callback) {
    if (bp.isArrayLike(obj)) {
      for (var i = 0; i < obj.length; i++ ) {
        callback.call(obj[i], i, obj[i]);
      }
    } else {
      for (var i in obj) {
        callback.call(obj[i], i, obj[i]);
      }
    }

    return obj;
  };

  // Recursively merges objects
  bp.extend = function ( objects ) {
    var extended = {};
    var merge = function (obj) {
      bp.each(obj, function(key, val) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if ( Object.prototype.toString.call(val) === '[object Object]' ) {
            extended[key] = bp.extend(extended[key], val);
          }
          else {
            extended[key] = val;
          }
        }
      });
    };

    bp.each(arguments, function(i, obj) {
      merge(obj);
    });
    return extended;
  };

  /**
   * The Backpack Object
   */
  bp.Object = function(selector) {

    var bpObj = this;

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return bpObj;
    }

    // HANDLE: $(string)
    if ( typeof selector === "string" ) {
      // HANDLE: $(html)
      if ( selector[0] === "<" &&
        selector[selector.length - 1] === ">" &&
        selector.length >= 3 ) {

        // Parse html
        try {
          bpObj[0] = bp.htmlParser
                      .parseFromString(selector, "application/xml")
                      .documentElement;
        } catch (e) {
          throw 'BackpackJS attempted to parse invalid html.';
        }

        bpObj.length = 1;
        return bpObj;

      // HANDLE: $(selector)
      } else {
        var query = document.querySelectorAll( selector );
        bp.each(query, function (i, node) {
          bpObj[i] = node;
        });
        bpObj.length = query.length;
        bpObj.selector = selector;
        return bpObj;
      }

    // HANDLE: $(DOMElement)
    } else if ( selector.nodeType > 0 ) {
      bpObj[0] = selector;
      bpObj.length = 1;
      return bpObj;

    // HANDLE: $(array|nodelist)
    } else if ( bp.areNodes(selector) ) {
      var nodeArray = Array.prototype.slice.call(selector);

      bp.each(nodeArray, function (i, node) {
        bpObj[i] = node;
      });
      bpObj.length = nodeArray.length;
      return bpObj;
    }
  };

  bp.fn = bp.Object.prototype = {
    length: 0,
    splice: [].splice
  };

  /**
   * Pack Function
   */
  bp.pack = function(namespace, base) {

    // Add method
    if (typeof base === "function") {

      // If autoIterate is true, iterate through elements
      if (arguments[2] === true) {
        bp.fn[namespace] = function() {
          for (var i = 0; i < this.length; i++) {

            // Pass the element object as `this`
            base.apply(this[i], arguments);
          }
          return this;
        };

      // Otherwise, pass backpack object as `this`
      } else {
        bp.fn[namespace] = base;
      }

      return;
    }

    // Setup a plugin
    bp.fn[namespace] = function () {

      var args = Array.prototype.slice.call(arguments),
          method = args[0],
          options = args.slice(1),
          selector = this.selector,
          query = [];

      bp.each(this, function(i, el) {

        var cachedPlugin = el["bp-" + namespace];

        if (cachedPlugin === undefined) {
          //make a clone of the base
          var plugin = bp.extend({}, base);

          //cache the element
          plugin.el = el;
          plugin.$el = bp(el);

          //cache the initial selector
          plugin._selector = selector;

          //cache the plugin
          plugin.el["bp-" + namespace] = plugin;

          //cache the options
          if (method !== undefined) plugin.options = method;

          //check for data attributes
          if (plugin.data) {
            var dataList = plugin.data;
            plugin.data = {};
            bp.each(dataList, function(i, name) {
              plugin.data[name] = plugin.el.getAttribute("data-" + name);
            });
          }

          //overwrite options with data and defaults
          plugin.settings = bp.extend({},
            plugin.defaults,
            plugin.options,
            plugin.data
          );

          //check for events
          if (plugin.events) {
            bp.each(plugin.events, function(eventName, method) {
              plugin.el.addEventListener(eventName, function (e) {
                plugin[method].call(plugin, e, this);
              });
            });
          }

          //fire up the plugin!
          if (plugin.init) plugin.init();

        } else if (cachedPlugin[method] && method.charAt(0) != '_') {
          //if method is a function
          if (typeof cachedPlugin[method] === 'function') {
            cachedPlugin[method].apply(cachedPlugin, options);
          //otherwise, treat it as a propery and reset it
          } else {
            cachedPlugin[method] = options[0];
          }

        }
      });

      return this;
    };
  };

  /**
   * Built-in bp methods
   */
  // Add helper to remove plugin
  bp.pack("unpack", function(namespace) {
    this["bp-" + namespace] = undefined;
  }, true);

  // Add helper to easily loop through backpack object
  bp.pack("each", function(callback) {
    bp.each(this, function(i, el) {
      callback.call(el, i, el);
    });
    return this;
  });

  return bp;

});
