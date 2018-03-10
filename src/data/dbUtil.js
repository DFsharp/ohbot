var MongoClient = require("mongodb").MongoClient;
var nconf = require("nconf");

var _db;

module.exports = {
  connect: function(callback) {
    MongoClient.connect(nconf.get("MONGODB_URL"), function(err, db) {
      _db = db;
      return callback(err);
    });
  },
  getDb: function() {
    return _db;
  }
};
