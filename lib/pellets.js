(function() {
  function merge(x) {
    var o = []
    for(var i=0; i<x.length; ++i) {
      var n = x[i];
      if(n === undefined) continue;
      else if(n.html !== undefined) o.push(n.html.call ? n.html() : n.html);
      else if(n.slice && !n.substr) o.push(merge(n));
      else o.push(String(n).replace(/&(?!(\w+|\#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
    }
    return o.join('');
  }

  function generate(template, opts) {
    var parser = require("./parser")
      , gen = require("escodegen")
      , parsed = parser.parse(template, opts)
      , code = gen.generate(parsed, opts);

    var fn = [
      "(function(self) {",
          "var __b = [], __m = (" + merge + ");",
          code.toString(),
          ";return __m(__b);",
      "})"
    ].join("");
    return fn;
  }

  function compile(template, opts) {
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
