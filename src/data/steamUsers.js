import nconf from "nconf";
import dbUtil from "./dbUtil";

const db = dbUtil.getDb();
const users = db.collection("steamUsers");

export default {
  addSteamUser: (steamUser, cb) => {
    users.findOneAndUpdate({discordUserId: steamUser.discordUserId},
                           {$setOnInsert: steamUser},
                           {upsert: true},
                           (err, result) => {
      if (err) {
        cb("An error occurred, broski");
        return;
      }
      if (result.value) {
        cb(`Updated user ${steamUser.username}`, result);
        return;
      }
      else{
        cb(null, result);
        return;
      }
    });
  },
  getSteamUser: (discordUserId, cb) => {
    users.findOne({discordUserId: discordUserId}, (err, res) => {
      cb(err, res);
    })
  }
}
