import bp from 'backpackjs';

bp.pack('trigger', function(eventType) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent(eventType, true, false);
  bp.each(this, function(el) {
    el.dispatchEvent(event);
  });
  return this;
});
