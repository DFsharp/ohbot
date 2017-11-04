import roll from "roll";

export default {
    roll:(msg, suffix)=>{
        let rolls = new roll();
        if(!rolls.validate(suffix)){
          msg.reply(`esa madre no es válida.`);
          return;  
        } 
        let result = rolls.roll(suffix);
        msg.reply(`rolaste un ${result.result}`);
    }
    
};