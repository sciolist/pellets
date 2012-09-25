#!/usr/bin/env node

var pellets = require('../')
  , fs = require('fs')
  , fileName = process.argv[2]
  , data = fs.readFileSync(fileName)
  ;
  
console.log(pellets.generate(data));
