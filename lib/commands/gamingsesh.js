import sessions from '../data/sessions';
import ArgumentParser from "argument-parser-extended";
import nconf from 'nconf';
import moment from 'moment';

export default {
    createsesh:(bot, msg, suffix) => {
        if (!suffix) return;
        //if (!nconf.get("ADMIN_IDS")[msg.author.id]){
        //    bot.sendMessage(msg.channel, "Nice try");
        //};
        
        let options = {
            name:{
                type:'string',
                required:true
            },
            date:{
                type:'string',
                //regex:/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
                required:true
            },
            recurring:{
                type:'boolean',
                default:false
            }
        };
        
        let argParser = new ArgumentParser('sesh',options);
        let res = {};
        try {
            res = argParser.parse(suffix);
        } catch (e) {
            let helpStr = argParser.getHelpString();
            bot.sendMessage(msg.channel, e);
        }
        let sesh = {
            name:res.name,
            users:[],
            date: moment(res.date,"DD/MM/YYYY-HH:mmaa"),
            //recurring:res.recurring
            };
            if (!sesh.date.isValid()) return;
            console.log(sesh.date.format("DD/MM/YYYY-HH:mma"));
            sessions.addSesh(sesh,(err, res)=>{
                if (err) {
                bot.sendMessage(msg.channel, err);
                return;
                }
            });
            bot.sendMessage(msg.channel,`Se creó la sesión ${sesh.name}`);
    },
    joinsesh:(bot, msg, suffix)=>{
        if (!suffix) return;
        sessions.addUserToSesh({name: suffix}, msg.author.id, (err, res)=>{
            if (err){
                bot.sendMessage(msg.channel, err);
                return;
            } 
            bot.sendMessage(msg.channel,`Se agregó ${msg.author.username} a la sesión ${suffix}`);
        });
    },
    remindsesh:(bot, msg, suffix) =>{
        
    }
}