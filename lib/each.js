import bp from 'backpackjs';

bp.pack('each', function(callback) {
  bp.each(this, function(i, el) {
    callback.call(el, i, el);
  });
  return this;
});
