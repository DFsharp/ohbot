var nconf = require('nconf');
nconf.argv()
.env()
.file({file: __dirname + '/lib/config.json'});

if (process.env.NODE_ENV){
    require('babel-register');
    require('./lib');
}
else
	require('./dist');