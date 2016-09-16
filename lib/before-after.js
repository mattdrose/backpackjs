import bp from 'backpackjs';

bp.pack('before', function(el) {
  this.insertAdjacentHTML('beforebegin', el);
}, true);

bp.pack('after', function(el) {
  this.insertAdjacentHTML('afterend', el);
}, true);
