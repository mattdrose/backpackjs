import bp from 'backpackjs';

bp.pack('remove', function() {
  this.parentNode.removeChild(this);
}, true);
