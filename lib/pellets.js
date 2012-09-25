(function() {
  exports.defaultOptions = {
    parse: {
      interpolator: '@',
      bufferName: '__b'
    }
  }

  function mergeResult(x) {
    var o = [];
    for(var i=0; x && i<x.length; ++i) {
      var n = x[i];
      if(n === undefined) continue;
      else if(n.html !== undefined) o.push(n.html.call ? n.html() : n.html);
      else if(n.slice && !n.substr) o.push(mergeResult(n));
      else o.push(String(n).replace(/&(?!(\w+|\#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
    }
    return o.join('');
  }

  function merge(dest) {
    for(var i=1; i<arguments.length; ++i) {
      var src = arguments[i];
      if(!dest) dest = {};
      for (var key in src) {
        if(!src.hasOwnProperty(key)) continue;
        dest[key] = typeof src[key] === 'object' ? merge(dest[key], src[key]) : src[key];
      }
    }
    return dest;
  }

  function generate(template, opts) {
    opts = merge({}, exports.defaultOptions, opts);
    var parser = require("./parser")
      , gen = require("escodegen")
      , parsed = parser.parse(template, opts)
      , code = gen.generate(parsed, opts);

    var fn = [
      "(function(self) {",
          "return (" + mergeResult + ")((function(self){" + (code.toString()) + "}).call(self||{},self||{}))",
      "})"
    ].join("");
    return fn;
  }

  function compile(template, opts) {
    opts = merge({}, exports.defaultOptions, opts);
    var code = generate(template, opts);
    var fn   = eval(code);
    function result(self) {
      return fn.call(self, self);
    }
    result.template = code;
    return result;
  }

  exports.generate = generate;
  exports.compile = compile;
})();
