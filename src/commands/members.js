import nconf from 'nconf';


export default {
    join: (msg, suffix) => {
        let roleId = nconf.get("MEMBERSHIP_ROLE_ID");        
        if (roleId)
            msg.member.addRole(`${roleId}`)
            .then(
                (fulfillment) => 
                {
                    msg.reply("Bienvenido a OUTER::HAVEN");
                }, 
                (rejection) => { });
    }
}