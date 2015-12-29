/**
 * 文件操作工具类
 */

'use strict';

var path = require('path'),
	fs = require('graceful-fs'),
	colors = require('colors'),
	semver = require('semver'),
	config = require('../config');

/**
 * 加载配置文件
 * @param  {string} filepath 文件路径
 * @return {object} 配置对象
 */
function loadConfigurationFile(filepath) {
	if (filepath) {
		try {
			return JSON.parse(fs.readFileSync(filepath, "utf8"));
		} catch (e) {
			console.log('ERR: package.json not found. => ' + filepath );
			process.exit(0);
		}
	}
	return undefined;
}
/**
 * 文件是否存在，不存在则创建
 * @return {boolean} isExists
 */
function isExistsDirectory(_path) {
	return fs.existsSync(_path) || fs.mkdirSync(_path);
}

/**
 * 复制目录中所有文件的子目录
 * @param  {String} src 源文件目录
 * @param  {String} dst 指定目录
 *                  
 */
function copyFile(src, dst) {
	// fse.copySync(src, dst, {
	// 	replace: true,
	// 	filter:function(src){
	// 		console.log(src);
	// 		return true;
	// 	}
	// })
	// return;
	
	var paths = fs.readdirSync(src);
 	//console.log(colors.grey('ynpm [log]: '),src)
	paths.forEach(function(_path) {

		var _src = path.resolve(src, _path),
			_dst = path.resolve(dst, _path),
			readable,
			writable;

		var st = fs.statSync(_src);

		if (st.isFile()) {

			// //创建读取流
			// readable = fs.createReadStream(_src);

			// //创建写入流
			// writable = fs.createWriteStream(_dst);

			// writable.on('close',function(e){
			// 	console.log(e)
			// })

			// readable.pipe(writable);
			// 
			fs.writeFileSync(_dst , fs.readFileSync( _src ))

		} else if (st.isDirectory()) {
			//判断目录是否存在
			isExistsDirectory(_dst);

			copyFile(_src, _dst);
		}
	});
	
	// fs.readdir( src , function(err,paths){
	// 	if(err){
	// 		console.log('ERR: '+e)
	// 	}
	// 	paths.forEach(function(_path){
	// 		var _src = path.resolve(src, _path),
	// 		_dst = path.resolve(dst, _path),
	// 		readable,
	// 		writable;

	// 	fs.stat(_src,function(err,state){
	// 		if(state.isFile()){
	// 			//创建读取流
	// 			readable = fs.createReadStream(_src);

	// 			//创建写入流
	// 			writable = fs.createWriteStream(_dst);

	// 			readable.pipe(writable);
	// 		}else if(state.isDirectory()){
	// 			isExistsDirectory(_dst);
	// 			copyFile(_src, _dst);
	// 		}
	// 	})
	// 	})
		
	// });
}

/**
 * 加载符合版本范围的文件
 * @param  {string} src          [description]
 * @param  {string} versionRange 版本范围 
 *                    see: https://docs.npmjs.com/files/package.json#dependencies
 */
function loadModulesConformVersionRange(src, versionRange) {
	var paths,
		notFound = true,
		matchs = [];

	try {
		paths = fs.readdirSync(src)
	} catch (e) {
		console.log('ERR: for ' + src + ' not found.');
		process.exit(0);
	}

	//遍历版本目录找出符合版本范围的目录
	//排序找出最高版本
	paths.forEach(function(_path) {
		var _src = path.resolve(src, _path),
			st = fs.statSync(_src);

		if (st.isDirectory()) {
			semver.satisfies(_path, versionRange) && matchs.push(_path);
		}
	});

	matchs.sort(function(a, b) {
		return a < b ? 1 : -1
	});

	if (!matchs.length) {
		console.log('ERR: for "' + src + '" not found.');
		process.exit(0);
	}

	return matchs[0];
}

/**
 * 写入配置文件
 * @param  {String} path 配置文件路径
 * @param  {Object} data 配置
 */
function writeConfig(path, data) {
	try {
		fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
	} catch (e) {
		console.log('ERR: set config fail.')
	}
}

/**
 * 遍历package 依赖
 * @param {string} path package path
 * @return {[type]} [description]
 */
function forEachPkgDependencies(path, callback) {
	var pkg = loadConfigurationFile(path),
		depends = config.dependencies,
		i = 0,
		len = depends.length,
		subDeps, k;
	for (; i < len; i++) {
		subDeps = pkg[depends[i]];
		for (k in subDeps) {
			callback && callback(k, subDeps[k]);
		}
	}
}

module.exports = {
	loadConfigurationFile: loadConfigurationFile,
	copyFile: copyFile,
	isExistsDirectory: isExistsDirectory,
	loadModulesConformVersionRange: loadModulesConformVersionRange,
	writeConfig: writeConfig,
	forEachPkgDependencies: forEachPkgDependencies
}