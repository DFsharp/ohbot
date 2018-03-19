import csgoStats from "csgo-stats";
import steamUsers from "../data/steamUsers";
import nconf from "nconf";

const steamAPIKey = nconf.get("STEAM_API_KEY");

export default {
  csgo: (msg, suffix) => {
    if (!suffix || msg.mentions.users.size !== 1) {
      msg.reply(`usage: ${help.csgo}`);
      return
    }

    const args = suffix.split(' ');

    const discordUserId = msg.mentions.users.firstKey();
    if (!discordUserId) return;

    steamUsers.getSteamUser(discordUserId, (err, res) => {
      if (err) ("An error occurred.");
      if (!res || res === null){
        console.log(`user: ${args[0]}`);
        msg.reply(`User ${msg.guild.member(args[0].replace('<@','').replace('>','')).displayName} not found`);
        return;
      }

      csgoStats.load({
        key: steamAPIKey,
        id: res.steamId
      })
      .then(r => {
        let stats = r.body.playerstats.stats.reduce((obj, item) => (obj[item.name] = item.value, obj), {});

        msg.channel.send(`\`\`\`${res.username}'s CS:GO Stats:
last match kills: ${stats["last_match_kills"]}
last match deaths: ${stats["last_match_deaths"]}
last match wins: ${stats["last_match_wins"]}
last match MVPs: ${stats["last_match_mvps"]}
total kills: ${stats["total_kills"]}
total deaths: ${stats["total_deaths"]}
total wins: ${stats["total_wins"]}
total MVPs: ${stats["total_mvps"]}
total knife kills: ${stats["total_kills_knife"]}\`\`\``);})
      .catch(e => msg.channel.send("Error: Steam profile is private or SteamId is invalid"));
    });

  },
  add_steamid: (msg, suffix) => {
    if (!suffix) return;
    const args = suffix.split(' ', 2);

    if (args.length != 2 || isNaN(args[0]) || msg.mentions.users.size !== 1) {
      msg.channel.send(`Invalid input. usage: ${help.add_steamid}`);
      return;
    }

    const mentionedUser = msg.mentions.users.first();

    const steamUser = {
      steamId: args[0],
      username: mentionedUser.username,
      discordUserId: mentionedUser.id
    };

    steamUsers.addSteamUser(steamUser, (err, res) => {
      if (err){
        msg.channel.send(err);
        return;
      }
      else
        msg.channel.send(`Steam user ${steamUser.username} added.`);
    });
  }
}

export const help = {
  csgo: "!csgo <@username> (mention) (add steam id with !add_steamid)",
  add_steamid: "!add_steamid <steam Id> <@username>. To obtain steam ID, visit https://steamidfinder.com"
}
