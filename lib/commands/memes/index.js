import fs from "fs";
import nconf from "nconf";


export default {
    test:(bot, msg) => {
        bot.sendMessage(msg.channel,"Testing, bitches.");
    }
    
};