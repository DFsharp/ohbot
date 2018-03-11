var nconf = require('nconf');
nconf.argv()
  .env()
  .file({file: __dirname + '/config.json'});

if (process.env.NODE_ENV != "production") {
  var dbUtil = require("./src/data/dbUtil");
  dbUtil.connect(function(err){
    require('babel-register');
    require('./src');
  });

}
else {
  var dbUtil = require("./dist/data/dbUtil");
    dbUtil.connect(function(err){
      require('./dist');
    });
}


