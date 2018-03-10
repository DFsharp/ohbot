import nconf from 'nconf';

export default {
  join: (msg, suffix) => {
    let roleId = nconf.get("MEMBERSHIP_ROLE_ID");
    if (roleId) {
      if (!msg.member.roles.find("id", roleId)) {
        msg.member.addRole(`${roleId}`)
          .then(
            (fulfillment) => {
              msg.reply("Welcome to OUTER::HAVEN");
            },
            (rejection) => { });
      }
    }
  }
}

export const help = {
  join: "!join"
}
