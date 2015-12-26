'use strict';

var fs = require('fs');

// Project metadata.
var pkg = require('../package.json');

// Display version.
exports.version = function() {
  console.log(pkg.name + ' v' + pkg.version);
};

// Show help and exit.
exports.help = function() {
  fs.createReadStream(__dirname + '/usage.txt')
    .pipe(process.stdout)
    .on('close', function() {
      process.exit();
    });
};