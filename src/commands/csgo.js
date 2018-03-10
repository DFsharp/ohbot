import csgoStats from "csgo-stats";
import steamUsers from "../data/steamUsers";
import nconf from "nconf";

const steamAPIKey = nconf.get("STEAM_API_KEY");

export default {
  csgo: (msg, suffix) => {
    if (!suffix) msg.reply(`usage: ${help.csgo}`);

    const args = suffix.split(' ');
    steamUsers.getSteamUser(args[0], (err, res) => {
      if (err || !res) return;

      csgoStats.load({
        key: steamAPIKey,
        id: res.steamId
      }).then(r => {
        let stats = r.body.playerstats.stats.reduce((obj, item) => (obj[item.name] = item.value, obj), {});

         msg.channel.send(`\`\`\`${res.username}'s CS:GO Stats:
last match kills: ${stats["last_match_kills"]}
last match deaths: ${stats["last_match_deaths"]}
last match wins: ${stats["last_match_wins"]}, (T: ${stats["last_match_t_wins"]}, CT: ${stats["last_match_ct_wins"]})
last match MVPs: ${stats["last_match_mvps"]}
total kills: ${stats["total_kills"]}
total deaths: ${stats["total_deaths"]}
total wins: ${stats["total_wins"]}
total MVPs: ${stats["total_mvps"]}
total knife kills: ${stats["total_kills_knife"]}\`\`\``);
      }).catch(e => console.error(e));
    });

  },
  add_steamid: (msg, suffix) => {
    if (!suffix) return;
    var args = suffix.split(' ', 2);

    const steamUser = {
      steamId: args[0],
      username: args[1]
    };

    steamUsers.addSteamUser(steamUser, (err, res) => {
      if (err || !res){
        msg.channel.send(err);
        return;
      }
      else
        msg.channel.send(`Steam user ${steamUser.username} added.`);
    });

  }

}

export const help = {
  csgo: "!csgo <username> (add steam id with !add_steamid)",
  add_steamid: "!add_steamid <steam Id> <username>"
}
