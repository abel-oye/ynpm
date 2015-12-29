'use strict';

var path = require('path');

var colors = require('colors');

var fu = require('./file-utils'),
	config = require('../config');

var NODE_MODULES_DIR = 'node_modules',
	BACK_UP_DIR = config.backUpPath;

fu.isExistsDirectory(BACK_UP_DIR);
/**
 * 通过遍历package中依赖，然后遍历node_modules 中package.json中version
 *
 * 拼出 modulesName/version/moduleName/*
 *
 * @example
 * 	package 
 * 		{
 * 			"dependencies":{
 * 				"ynpm":"0.0.1"
 * 			}
 * 		}
 * 	node_modules
 * 		ynpm 
 * 			package
 * 				{
 * 					"version":"0.0.1"
 * 				}
 * 				
 * 	生成备份路径：ynpm/0.0.1/ynpm
 * 		
 * 
 */
var beginTime = Date.now();
console.log('ynpm [log] start copy file.')
fu.forEachPkgDependencies('package.json',function(key,version,i,deps){
	var _p = path.resolve(NODE_MODULES_DIR,key),
		_backupPath = BACK_UP_DIR;
	
	var pkgConf = fu.loadConfigurationFile( path.join(_p,'package.json') );

	[key,pkgConf.version,key].forEach(function(i){

		_backupPath = path.join(_backupPath,i);

		fu.isExistsDirectory(_backupPath)
	});
	
	fu.copyFile( _p , _backupPath );
	
});
console.log('ynpm [log] end copy file.')

console.log(colors.green('ynpm publish success. backUp path: '+BACK_UP_DIR));