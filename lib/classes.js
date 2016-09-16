import bp from 'backpackjs';

// map some classlist functions to the jQuery-like counterpart
var classHelpers = {
  addClass: 'add',
  removeClass: 'remove',
  toggleClass: 'toggle'
};

bp.each(classHelpers, function(val, key) {
  bp.pack(key, function(className) {
    this.classList[val](className);
  }, true);
});

bp.pack('hasClass', function(className) {
  return this[0].classList.contains(className);
});
