import fs from "fs";
import nconf from "nconf";
import roll from "roll";


export default {
    dank:(bot, msg, suffix) => {
        bot.sendMessage(msg.channel,"Testing, bitches.");
    },
    addmeme:(bot, msg, suffix ) =>{
        
    }
    //roll:(bot,msg, suffix)=>{
    //    let rolls = new roll();
    //    if(!rolls.validate(suffix)){
    //      bot.sendMessage(msg.channel, `Hey ${msg.author.username}: esa madre no es válida.`);
    //      return;  
    //    } 
    //    let result = rolls.roll(suffix);
    //    bot.sendMessage(msg.channel,`${msg.author.username} rolled a ${result.result}`);
    //}
    
};