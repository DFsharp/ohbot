import fs from 'fs';
import nconf from 'nconf';
import {Client as Discord, PMChannel} from 'discord.js';
import commands from "./commands";

nconf.argv()
.env()
.file({file: __dirname + '/config.json'});


if (!nconf.get('EMAIL') || !nconf.get('PASSWORD')) {
  console.error('No email or password set.');
  console.log(nconf.get('PREFIX'));
  process.exit(1);
}

//init
const bot = new Discord();
bot.on('ready', () => {
    console.log("it's on, bitches!");
    console.log('serving on' + bot.servers.length + 'servers');
});



bot.on('message', (msg) =>{
    if(bot.user.username === msg.author.username){
        return;
    }
    //console.log(`${msg.author.username} with id ${msg.author.id} is saying: ${msg.content}`)   

    if(msg.content[0] === nconf.get("PREFIX")){
        //console.log('a command appeared.');
        let command = msg.content.toLowerCase().split(' ')[0].substring(1);
        let cmd = commands[command];
        let suffix = msg.content.substring(command.length + 2);
        if (cmd) cmd(bot,msg, suffix);
        return;
    }
});


bot.on('serverDeleted',(server) =>console.log(`'left server ${server.name}'`));


bot.login(nconf.get("EMAIL"),nconf.get("PASSWORD"));


