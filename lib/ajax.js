import bp from 'backpackjs';

bp.ajax = function(url, options) {
  var settings = {
    method: 'GET',
    data: false,
    success: false,
    error: false
  };
  for (var option in options) {
    settings[option] = options[option];
  }
  var xhr = new XMLHttpRequest();
  xhr.open(settings.method, settings.url, true);
  xhr.onerror = function() {
    settings.error(this);
  };
  xhr.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400){
        settings.success(this.response, this.status, this);
      } else {
        settings.error(this);
      }
    }
  };
  if (settings.data) {
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(settings.data);
  } else {
    xhr.send();
  }
  xhr = null;
};
