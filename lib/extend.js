import bp from 'backpackjs';

bp.extend = function (objects) {
  var extended = {};
  var merge = function (obj) {
    bp.each(obj, function(key, val) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (Object.prototype.toString.call(val) === '[object Object]') {
          extended[key] = bp.extend(extended[key], val);
        }
        else {
          extended[key] = val;
        }
      }
    });
  };

  bp.each(arguments, function(i, obj) {
    merge(obj);
  });
  return extended;
};
