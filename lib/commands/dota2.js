import Dota2Api from "dota2api";
import nconf from 'nconf';
import dotards from '../data/dotards';

//steamidfinder.com

export default  {
    dotard:(bot, msg, suffix)=>{
        if (!dotards[suffix]){
            bot.sendMessage(msg.channel,`No saco a ${suffix}.`); 
            return;
        };
        
        let dota = new Dota2Api(nconf.get('DOTA_API_KEY'));
        
        dota.getByAccountID(dotards[suffix],(err, res)=>{
            if (err) return;
            //console.log(res.status);
            if (res.status === 15){
                bot.sendMessage(msg.channel,`User is set to private`);
                return;
            }
            let last = res.matches[res.num_results-1].match_id;
            dota.getMatchDetails(last,(err, res)=>{
                console.log(`${res.kills} kills`)
            })
        });
    },
    adddotard:(bot,msg,suffix)=>{
        
    }
    
}