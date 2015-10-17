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

  var bp = function( selector ) {

    return new bp.Object( selector );

  };

  bp.htmlParser = new DOMParser();

  bp.Object = function( selector ) {

    // HANDLE: $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return this;
    }

    // HANDLE: $(string)
    if ( typeof selector === "string" ) {
      // HANDLE: $(html)
      if ( selector[ 0 ] === "<" &&
        selector[ selector.length - 1 ] === ">" &&
        selector.length >= 3 ) {

        this[0] = bp.htmlParser
                          .parseFromString(selector, "application/xml")
                          .documentElement;
        this.length = 1;
        return this;

      // HANDLE: $(selector)
      } else {
        var query = document.querySelectorAll( selector );
        for ( var i = 0; i < query.length; i++ ) {
          this[i] = query[i];
        }
        this.length = query.length;
        this.selector = selector;
        return this;
      }

    // HANDLE: $(DOMElement)
    } else if ( selector.nodeType ) {
      this[0] = selector;
      this.length = 1;
      return this;
    }
  };

  bp.fn = bp.Object.prototype = {
    length: 0,
    splice: [].splice
  };

  bp.extend = function ( objects ) {
    var extended = {};
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if ( Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = bp.extend(extended[prop], obj[prop]);
          }
          else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    merge(arguments[0]);
    for (var i = 1; i < arguments.length; i++) {
      var obj = arguments[i];
      merge(obj);
    }
    return extended;
  };

  bp.pack = function( namespace, base ) {

    if (typeof base === "function") {
      bp.fn[namespace] = base;
      return;
    }

    bp.fn[namespace] = function () {

      var args = Array.prototype.slice.call(arguments),
          method = args[0],
          options = args.slice(1),
          selector = this.selector,
          query = [];

      for(var i = 0; i < this.length; i++) {

        var el = this[i];

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
            dataList.forEach(function( name ) {
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
            for (var evt in plugin.events) {
              var handler = plugin.events[evt];

              plugin.el.addEventListener(evt, function (e) {
                console.log(evt);
                console.log(plugin[handler]);
                plugin[handler].call(plugin, e, this);
              });
            }
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
      }

      return this;
    };
  };

  // Add helper to remove plugin
  bp.pack("unpack", function( namespace ) {

    for(var i = 0; i < this.length; i++) {

      this[i]["bp-" + namespace] = undefined;

    }

  });

  return bp;

});
