
let help = {
    "createsession":"!createsession --name <name> --date <DD/MM/YYYY-HH:MMpm/am>",
    "join":"!join <session name>",
    "leave":"!leave <session name>",
    "remind":"!remind <session name>",
    "roll":"!roll <dice>\n dice= d6, 2d20, etc"
    
}
export default {
    help:(msg, suffix) => {
        if (!suffix) {
            msg.author.send(help);
        }
        else if (help[suffix])
            msg.channel.send(help[suffix]);        
    }
}