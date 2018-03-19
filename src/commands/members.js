import nconf from 'nconf';

const membershipId = nconf.get("MEMBERSHIP_ROLE_ID");
const adminChannelId = nconf.get("ADMIN_CHANNEL_ID");

export default {
  join: (msg, suffix) => {
    if (!membershipId || !adminChannelId || !msg.guild.available) return;

    if (!msg.member.roles.find("id", membershipId)) {
      const adminChannel = msg.guild.channels.get(adminChannelId);

      if (adminChannel) {
        msg.reply("request sent to Big Boss.");
        adminChannel.send(`${msg.member} would like to join ${msg.guild.name}`);
      }
    }
  }
}

export const help = {
  join: "!join"
}
