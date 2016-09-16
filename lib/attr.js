import bp from 'backpackjs';

bp.pack('attr', function(name, val) {
  if (val === undefined) {
    return this[0].getAttribute(name);
  } else {
    return bp.each(this, function() {
      this.setAttribute(name, val);
    });
  }
});

bp.pack('removeAttr', function(name) {
  this.removeAttribute(name);
}, true);

bp.pack('hasAttr', function(name) {
  return this[0].hasAttribute(a);
});
