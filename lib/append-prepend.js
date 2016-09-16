import bp from 'backpack';

bp.pack('append', function(el) {
  this.appendChild(el);
}, true);

bp.pack('preprend', function(el) {
  this.insertBefore(el, this.firstChild);
}, true);
