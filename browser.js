global.pellets = require("./lib/pellets.js")

var compiled = {};
global.pellets.compileElement = function(id) {
  var element = document.getElementById(id), template, found;
  template = (element && (element.innerHTML || element.value)) || "";
  found = compiled[template];
  if(found === undefined) {
    found = compiled[template] = global.pellets.compile(template);
  }
  return found;
}

