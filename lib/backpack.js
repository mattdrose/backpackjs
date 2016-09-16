export default function bp(selector) {
  return new bp.Object(selector);
}

/** Whether argument is an array or array-like object of node objects */
bp.areNodes = function(nodes) {
  return typeof nodes === 'object' &&
    nodes.hasOwnProperty('length') &&
    (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
};

/** Whether object is array, or array like */
/** http://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like */
bp.isArrayLike = function(obj) {
  return (
    Array.isArray(obj) ||
    (!!obj &&
      typeof obj === "object" &&
      typeof (obj.length) === "number" &&
      (obj.length === 0 ||
        (obj.length > 0 &&
        (obj.length - 1) in obj)
      )
    )
  );
};

/** Iterate through arrays, array-likes, and objects */
bp.each = function(obj, callback) {
  if (bp.isArrayLike(obj)) {
    for (var i = 0; i < obj.length; i++ ) {
      callback.call(obj[i], i, obj[i]);
    }
  } else {
    for (var i in obj) {
      callback.call(obj[i], i, obj[i]);
    }
  }

  return obj;
};

/** Recursively merges objects */
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

/** The Backpack Object */
bp.Object = function(selector) {
  var bpObj = this;

  // HANDLE: $(""), $(null), $(undefined), $(false)
  if (!selector) {
    return bpObj;
  }

  // HANDLE: $(string)
  if (typeof selector === "string") {
    // HANDLE: $(html)
    if (selector[0] === "<" &&
      selector[selector.length - 1] === ">" &&
      selector.length >= 3) {

      var wrapper = document.createElement('div');
      wrapper.innerHTML = selector;
      bpObj[0] = wrapper.firstChild;

      bpObj.length = 1;
      return bpObj;

    // HANDLE: $(selector)
    } else {
      var query = document.querySelectorAll(selector);
      bp.each(query, function (i, node) {
        bpObj[i] = node;
      });
      bpObj.length = query.length;
      bpObj.selector = selector;
      return bpObj;
    }

  // HANDLE: $(DOMElement)
  } else if (selector.nodeType > 0) {
    bpObj[0] = selector;
    bpObj.length = 1;
    return bpObj;

  // HANDLE: $(array|nodelist)
  } else if (bp.areNodes(selector)) {
    var nodeArray = Array.prototype.slice.call(selector);

    bp.each(nodeArray, function (i, node) {
      bpObj[i] = node;
    });
    bpObj.length = nodeArray.length;
    return bpObj;
  }
};

/** Make the bp object array like */
bp.fn = bp.Object.prototype = {
  length: 0,
  splice: [].splice
};

/** Pack Function */
bp.pack = function(namespace, func) {
  // If autoIterate is true, iterate through elements
  if (arguments[2] === true) {
    bp.fn[namespace] = function() {
      for (var i = 0; i < this.length; i++) {
        // Pass the element object as `this`
        func.apply(this[i], arguments);
      }
      return this;
    };
  } else {
    bp.fn[namespace] = func;
  }
};
