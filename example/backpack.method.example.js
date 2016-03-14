/**
 * This is an example of creating a method for BackpackJS.
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
