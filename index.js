var nconf = require('nconf');
nconf.argv()
.env()
.file({file: __dirname + '/lib/config.json'});

require('babel-register');
require('./lib');
