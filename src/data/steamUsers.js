import nconf from "nconf";
import dbUtil from "./dbUtil";

const db = dbUtil.getDb();
const users = db.collection("steamUsers");

export default {
  addSteamUser: (steamUser, cb) => {

    users.findOneAndUpdate({username: steamUser.username},
                           {$setOnInsert: steamUser},
                           {upsert: true},
                           (err, result) => {
      if (result.value) {
        cb(`Updating user ${steamUser.username}`, result);
        return;
      }
      else{
        cb(null, result);
        return;
      }
    });
  },
  getSteamUser: (steamUsername, cb) => {
    users.findOne({username: steamUsername}, (err, res) => {
      cb(err, res);
    })
  }
}
