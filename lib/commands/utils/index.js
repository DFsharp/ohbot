import roll from "roll";


export default {
    roll:(bot, msg, suffix)=>{
        let rolls = new roll();
        if(!rolls.validate(suffix)){
          bot.sendMessage(msg.channel, `Hey ${msg.author.username}: esa madre no es válida.`);
          return;  
        } 
        let result = rolls.roll(suffix);
        bot.sendMessage(msg.channel,`${msg.author.username} rolled a ${result.result}`);
    }
    
};