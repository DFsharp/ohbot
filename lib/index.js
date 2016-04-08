import fs from 'fs';
import nconf from 'nconf';
import {Client as Discord, PMChannel} from 'discord.js';

nconf.argv()
.env()
.file({file: '../config.json'});


if (!nconf.get('EMAIL') || !nconf.get('PASSWORD')) {
  console.error('No email or password set.');
  process.exit(1);
}

//init
const bot = new Discord();
bot.on('ready', () => {
    
});



bot.on('message',(msg) =>{
    if(bot.user.username === msg.author.username)
        return;

    if(msg.content[0] === nconf.get("PREFIX")){
        let command = msg.content.toLowerCase().split(' ')[0].substring(1);
        let cmd = commands[command];
        if (cmd) callCmd(cmd,bot,msg);
        return;
    }
});



//bot.login(nconf.get("EMAIL"),nconf.get("PASSWORD"));


