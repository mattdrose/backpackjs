import bp from 'backpackjs';

bp.pack('first', function() {
  return bp(this[0]);
});

bp.pack('last', function() {
  return bp(this[this.length - 1]);
});

bp.pack('get', function(index) {
  return bp(this[index]);
});
