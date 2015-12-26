'use strict';

// External lib.
var nopt = require('nopt');

// CLI options we care about.
exports.known = {
	help: Boolean,
	version: Boolean,
	config: Boolean,
	path: Boolean,
	install:Boolean,
	publish:Boolean
};
exports.aliases = {
	h: '--help',
	v: '--version',
	c: '--config',
	p: '--path',
	i: 'install'
};

// Parse them and return an options object.
Object.defineProperty(exports, 'options', {
	get: function() {
		return nopt(exports.known, exports.aliases, process.argv, 2);
	}
});