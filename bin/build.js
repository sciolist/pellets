#!/usr/bin/env node

var pellets = require('../')
  , fs = require('fs')
  , fileName = process.argv[2]
  , opts = JSON.parse(process.argv[3])
  , run = process.argv[4]
  , data = fs.readFileSync(fileName)
  , generated
  ;
  
if(run !== undefined) {
  var result = pellets.compile(data, opts)(JSON.parse(run));
  console.log(result);
  return;
}

generated = pellets.generate(data, opts);
console.log(generated);
