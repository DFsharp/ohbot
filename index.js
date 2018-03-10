var nconf = require('nconf');
nconf.argv()
.env()
.file({file: __dirname + '/src/config.json'});

if (!process.env.NODE_ENV){

  var dbUtil = require("./src/data/dbUtil");
  dbUtil.connect(function(err){
    require('babel-register');
    require('./src');
  });

}
//else
//	require('./dist');

