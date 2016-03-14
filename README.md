# BackpackJS [![Build Status](https://travis-ci.org/mattdrose/backpackjs.svg?branch=master)](https://travis-ci.org/mattdrose/backpackjs) [![Sauce Test Status](https://saucelabs.com/buildstatus/backpackjs)](https://saucelabs.com/u/backpackjs)

I love jQuery, but I hate bloat. The struggle is real. BackpackJS helps you keep the syntax of jQuery, while replacing it with your own vanilla javascript.

BackpackJS is two things: a way to select DOM elements, and a way to add plugins and helpers to manipulate selected elements. That's it. There's nothing fancy here—just an interface that helps you do your thing.

| Library       | Minified | gzip  |
| ------------- |---------:| -----:|
| **jQuery**    |    ~96kb | ~34kb |
| **Zepto.js**  |    ~25kb | ~10kb |
| **BackpackJS**|     ~2kb |  ~1kb |

Feel free to poke around the `/examples`, or read up on documentation.

## Installation

### Bower

```
bower install backpackjs --save-dev
```

### NPM

```
npm install backpackjs --save-dev
```

## Usage

Make sure BackpackJS is loaded before your add-ons. BackpackJS supports being loaded as an AMD or CommonJS module.

### Selector

The BackpackJS selector is much like jQuery's, only it's lightweight by taking advantage of the query selector built into modern browsers.

``` javascript
bp('#js-ids');
bp('.js-classes');
bp('div');
bp(domElement);
```

## Methods

You can add methods by passing `bp.pack` your method name and a callback function.

``` javascript
bp.pack('setText', function(text) {/*...*/});
```

The callback will be run when the method is invoked, passing along any arguments. `this` will refer to the current Backpack Object (an array-like list of elements).

``` javascript
bp.pack('setText', function(text) {
  this.each(function() {
    this.textContent = text;
  });
  return this;
});
```

The method can then be run on `bp()` selected elements.

``` javascript
bp('#js-hello').setText('Hello world!');
```

Note: You can pass an optional third argument to automatically iterate through all of the elements in the Backpack Object.

``` javascript
bp.pack('setText', function(text) {
  this.textContent = text;
}, true);
```

Note: BackpackJS comes with one built-in method: `.each`. This method works exactly like [jQuery's `.each`](http://api.jquery.com/each/).

## Plugins

Create a new plugin by passing `bp.pack` your plugins name and the *plugin object*.

``` javascript
bp.pack('tooltip', {});
```

Once `bp.pack` has been called, you can call the plugin on `bp()` selected elements.

``` javascript
bp('.js-tooltip').tooltip();
```

And yes, this is chainable :).

## The Plugin Object

The plugin object you pass contains your settings and variables, as well as your private and public methods. The plugin object is the heart of your plugin since you'll have access to this object via the ```this``` keyword in all of your private and public methods.

Technically you can run this object however you want, but there are certain key items that the plugin object is expecting.

**Understanding this concept requires you understand both [Setting Up The Object](#setting-up-the-object) and [Using The Object](#using-the-object).**

### Setting Up The Object

#### `defaults`

`defaults` are the default settings for your plugin. When a user uses your plugin, they'll have the opportunity to pass their own settings to overwrite these values.

##### Example

``` javascript
bp.pack('tooltip', {
  defaults: {
    tip: 'This is a tip!'
  }
});
```

Once the `defaults` are set, they can be overwritten by the user when the plugin is initiated.

``` javascript
bp('.js-tooltip').tooltip({
  tip: 'And he tipped his hat like this.'
});
```

#### `events`

`events` are bound to the element that the plugin is bound to. The associated values are the names of the methods that will be run when the event is triggered.

##### Example

``` javascript
bp.pack('tooltip', {
  events: {
    'mouseenter': 'open',
    'mouseleave': 'close'
  }
});
```

#### `data`

`data` is a list of `data-attributes` that the plugin will look for to overwrite the settings.

##### Example

``` javascript
bp.pack('tooltip', {
  data: ['tip']
});
```

Now you can set `tip` using the dom elements `data-attribute`.

``` html
<span class="js-tooltip" data-tip="Urr body in da club gettin tipsy!">Holla!</span>
```

**Note**: This data value will overwrite both the default and user set values.

#### `init`

`init` is a function that will automatically be run when the plugin is initiated. This is a good place to cache elements or do any heavy lifting to prepare the plugin for action.

##### Example

``` javascript
bp.pack('tooltip', {
  init: function() {
    var plugin = this;

    /* cache */
    plugin.$wrapper = bp('<div class="js-tooltip__wrapper"></div>');
    plugin.wrapper = plugin.$wrapper[0];

    plugin.$tip = bp('<div class="js-tooltip__tip"></div>');
    plugin.tip = plugin.$tip[0];

    /* add the tip */
    plugin.tip.innerHTML = plugin.settings.tip;

    /* wrap the el */
    var parent  = plugin.el.parentNode;
    var sibling = plugin.el.nextSibling;
    plugin.wrapper.appendChild(plugin.el);
    if (sibling) {
        parent.insertBefore(plugin.wrapper, sibling);
    } else {
        parent.appendChild(plugin.wrapper);
    }

    /* append tip */
    plugin.wrapper.appendChild(plugin.tip);
  }
});
```

#### `publicMethods`

Public methods are methods that can easily be run by the user.

##### Example

``` javascript
bp.pack('tooltip', {
  open: function() {
    var plugin = this;

    plugin.tip.className = plugin.tip.className + " is-open";
  }
});
```

The user can run this function by calling the plugin after it's been initiated.

``` javascript
// Initiate
bp('.js-tooltip').tooltip();

// Call public method
bp('.js-tooltip').tooltip('open');
```

**Note**: The user can pass variables to the function in the same way.

``` javascript
bp('.js-tooltip').tooltip('updateTip', 'This is a new tip!');
```

#### `_privateMethods`

Private methods are methods that can be run from within the plugin, but they can't be accessed by the user. These methods can be recognized by having a prefixed underscore.

### Using The Object

#### `var plugin = this;`

You can reference the plugin object from within a method by calling `this`. It's good practice to store this value into a plugin variable.

##### Example

``` javascript
bp.pack('tooltip', {
  open: function() {
    var plugin = this;
  }
});
```

#### `plugin.$el`

You have access to the dom element that the plugin has been bound to through `plugin.$el` (BackpackJS object), and `plugin.el` (dom element).

#### `plugin.settings`

`plugin.settings` are the settings for the plugin based on `defaults`, `options`, and `data`. `settings` take priority based on `data` > `options` > `defaults`.

##### Example

``` javascript
bp.pack('tooltip', {
  defaults: {
    tip: 'This is the default tip.'
  },
  logTip: function() {
    var plugin = this;
    console.log(plugin.settings.tip);
  }
});

bp('.js-tooltip').tooltip({
  tip: 'This is the user option tip.'
}).tooltip('logTip');
// Logs 'This is the user option tip.'
```

**Note**: The plugin object also gives you access to `plugin.defaults`, `plugin.options`, and `plugin.data`.

### Hackability

At any time you can access the full plugin object using the cached reference `bp-{namespace}`.

``` javascript
bp('#js-tooltip').tooltip({
  tip: 'My last tip.'
});

console.log(bp('#js-tooltip')[0]['bp-tooltip'].settings.tip) // 'My last tip.';
```

## Browser Tests Status

[![Sauce Test Status](https://saucelabs.com/browser-matrix/backpackjs.svg)](https://saucelabs.com/u/backpackjs)
