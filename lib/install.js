'use strict';
/**
 * 安装模块
 * @author river
 * 
 */

var path = require('path');

var colors = require('colors');

var fu = require('./file-utils'),
	config = require('../config');

var DEPENDS = config.dependencies,
	BACK_UP_PATH = config.backUpPath,
	NODE_MODULES_DIR = 'node_modules';

var basedir = process.cwd();

//判断node_modules 目录是否存在
fu.isExistsDirectory(NODE_MODULES_DIR);


exports.install = function(){
	console.log('ynpm [log] start copy file.')
	fu.forEachPkgDependencies('package.json',function(key,version){

		var _p = path.resolve(BACK_UP_PATH,key);

		var rangePath = fu.loadModulesConformVersionRange( _p , version );

		
		fu.copyFile( path.join(_p,rangePath) , NODE_MODULES_DIR );
	});
	console.log('ynpm [log] end copy file.')
	console.log(colors.green('ynpm install [success]. backUp path: '+BACK_UP_PATH));
}

