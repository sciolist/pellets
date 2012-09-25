#!/usr/bin/env node
require("shelljs/make")
var fs = require("fs");

target.all = function() {
  target.browser();
  target.test();
}

target.browser = function() {
  console.log("Bundling browser version..");

  var browserify = require("browserify")
    , minify = require("node-minify")
    , source = null;

  source = browserify("browser.js", {
    ignore: ["source-map"] 
  }).bundle();

  fs.writeFileSync("./browser/pellets.js", source);
  new minify.minify({
    type: "gcc",
    fileIn: "./browser/pellets.js",
    fileOut: "./browser/pellets.min.js",
    callback: function(err) {
      if(err) console.error(err);
    }
  });
}

target.test = function() {
  console.log("Running tests..");
  exec("mocha --growl test/")
}
