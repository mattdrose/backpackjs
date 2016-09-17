import bp from 'backpackjs';

bp.pack('hide', function() {
  this.style.display = 'none';
}, true);

bp.pack('show', function() {
  this.style.display = '';
}, true);
