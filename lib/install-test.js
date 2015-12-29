'use strict';

var child_process = require('child_process');

var install = require('./install');

exports.test = function(){
	var beginTime = Date.now();
	child_process.exec('npm install');
	console.log('%s Ms',Date.now() - beginTime);
	//install.install();
	console.log('%s Ms',Date.now() - beginTime);
}