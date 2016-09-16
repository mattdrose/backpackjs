import bp from 'backpackjs';

bp.pack('css', function(className, val) {
  if (typeof(className) === 'object') {
    for(var prop in className) {
      bp.each(this, function(el) {
        el.style[prop] = className[prop];
      });
    }
    return this;
  } else {
    return val === undefined ? this[0].style[className] : bp.each(this, function(el) {
      el.style[className] = val;
    });
  }
});
