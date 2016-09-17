import bp from 'backpackjs';

bp.pack('parent', function() {
  var parents = [];
  bp.each(this, function(el) {
    parents.append(el.parentNode);
  });
  return bp(parents);
});
