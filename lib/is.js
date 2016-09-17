import bp from 'backpackjs';

bp.pack('is', function() {
  var el = this[0];
  var matches = (el.matches ||
                 el.matchesSelector ||
                 el.msMatchesSelector ||
                 el.mozMatchesSelector ||
                 el.webkitMatchesSelector ||
                 el.oMatchesSelector);
  return matches.call(el, selector);
});
