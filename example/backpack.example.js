/**
 * This is an example of creating a helper for BackpackJS.
 * This acts as reference and should not be used in production
 *
 * bp.pack
 * @param {string} namespace - The name of your helper
 * @param {function} helper - The function helper
 */
bp.pack('wrap', function($wrapper) {
  var wrapper = $wrapper[0];

  /* Loops backwards to prevent having to clone the wrapper on the first
     element (see `wrap` below). */
  for (var i = this.length - 1; i >= 0; i--) {
    var wrap  = (i > 0) ? wrapper.cloneNode(true) : wrapper;
    var el    = this[i];

    /* Cache the current parent and sibling. */
    var parent  = el.parentNode;
    var sibling = el.nextSibling;

    /* Wrap the element (is automatically removed from its current parent). */
    wrap.appendChild(el);

    /* If the element had a sibling, insert the wrapper before the sibling to
       maintain the HTML structure; otherwise, just append it to the parent. */
    if (sibling) {
      parent.insertBefore(wrap, sibling);
    } else {
      parent.appendChild(wrap);
    }
  }
});

/**
 * This is an example of creating a plugin for BackpackJS.
 * This acts as reference and should not be used in production
 *
 * bp.pack
 * @param {string} namespace - The name of your plugin
 * @param {object} base - The base of your plugin
 */
bp.pack('tooltip', {

  /* The default settings for the plugin. These can be overwritten by the
     options passed on initiation. */
  defaults: {
    tip: 'This is a tip!',
    animationSpeed: 500
  },

  /* Events to bind onto the plugins dom element(s). You can use these events
     to call a function within the plugin. */
  events: {
    mouseEnter: 'open',
    mouseLeave: 'close'
  },

  /* A list of supported data-attribute variables. These will overwrite
     both the defaults and the options in the plugins settings. */
  data: ['tip'],

  /* The function which runs on initiation. A good time to cache. */
  init: function(){

    /* 'this' always refers to the plugin. It's good practice to store a
       reference. */
    var plugin = this;

    /* cache */
    plugin.$wrapper = bp('<div class="js-tooltip__wrapper"></div>');
    plugin.wrapper = plugin.$wrapper[0];

    plugin.$tip = bp('<div class="js-tooltip__tip"></div>');
    plugin.tip = plugin.$tip[0];

    /* Add the tip */
    plugin.$tip[0].innerHTML = plugin.settings.tip;

    /* plugin.el and plugin.$el are references to the dom element. */

    /* wrap the el */
    plugin.$el.wrap(plugin.$wrapper);

    /* append tip */
    plugin.wrapper.appendChild(plugin.tip);

  },

  /* Public methods like this are accessible outside of the plugin. Private
     methods begin with _. These methods can't be accessed outside of the
     plugin. */
  open: function(){
    /* The plugin object gives you full access to the plugin */
    var plugin = this;

    /* The plugin settings are created from data, options, and defaults.
       Settings take priority as follows: data > options > defaults */
    plugin.tip.className = plugin.tip.className + " is-open";
  },

  close: function(){
    var plugin = this;
    plugin.tip.className = plugin.tip.className.replace(/\bis-open\b/, "");
  }
});
