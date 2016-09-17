import bp from 'backpackjs';

bp.pack('text', function(value) {
  return value === undefined ? this[0].textContent : bp.each(this, function(el) {
    el.textContent = value;
  });
});

bp.pack('html', function(content) {
  return content === undefined ? this[0].innerHTML : bp.each(this, function(el) {
    el.innerHTML = content;
  });
});
