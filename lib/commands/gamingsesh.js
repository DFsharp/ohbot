import sessions from '../data/sessions';
import ArgumentParser from "argument-parser-extended";
import nconf from 'nconf';
import moment from 'moment';

moment.locale('es');
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
                required:true
            },
            recurring:{
                type:'boolean',
                default:false
            },
            description:{
                type:'string',
                default:""
            }
        };
        
        let argParser = new ArgumentParser('sesh',options);
        let res = {};
        try {
            res = argParser.parse(suffix);
        } catch (e) {
            let helpStr = argParser.getHelpString();
            bot.sendMessage(msg.channel, e);
            return;
        }
        
        let sesh = {
            name:res.name,
            users:[],
            date: moment(res.date,"DD/MM/YYYY-hh:mma"),
            recurring:res.recurring,
            server: msg.channel.server.id,
            description:res.description
            };
            
            if (!sesh.date.isValid()) return;
            //console.log(sesh.date.format("DD/MM/YYYY-hh:mma"));
            sessions.addSesh(sesh,(err, res)=>{
                if (err || !res) {
                bot.sendMessage(msg.channel, err);
                return;
                }
                else
                    bot.sendMessage(msg.channel,`Se creó la sesión ${sesh.name}. Si quieres unirte, escribe: !joinsesh ${sesh.name}`);
            });
            
    },
    join:(bot, msg, suffix)=>{
        if (!suffix) return;
        sessions.addUserToSesh({name: suffix}, {id:msg.author.id, remind:true}, (err, res)=>{
            if (err){
                bot.sendMessage(msg.channel, err);
                return;
            } 
            bot.sendMessage(msg.channel,`Se agregó ${msg.author.username} a la sesión ${suffix}`);
        });
    },
    remind:(bot, msg, suffix) =>{
        if (!suffix) return;
        sessions.getSession({name:suffix}, (err, res)=>{
            let date = moment(res.date._i,"DD/MM/YYYY-hh:mma");
            let now = moment();
            if (now.isAfter(date)) return;
            console.log(res);
            if (err || !res) return;
            for (var i = 0; i < res.users.length; i++) {
                var user = res.users[i];
                if (!user.remind) continue;                
                let message = `Vato, te recuerdo que hay una gaming session el ${date.format("DD/MM/YYYY")} a las ${date.format("hh:mma")}\n o sea, ${date.from(now)}. Si ya no quieres que siga cagando palo, escribe !-----`;
                bot.sendMessage(user.id,message);
            }
            
        });
    },
    sessions:(bot, msg, suffix) =>{        
        sessions.getAllSessions(msg.channel.server.id,(err, docs)=>{
            if (err) return;
           // bot.sendMessage(msg.channel,`Vatos, estas son las sesiones que hay: ${docs.length}`);
            let available = 0;
            for (let i = 0; i < docs.length; i++){                
                if(moment().isAfter(moment(docs[i].date._i,"DD/MM/YYYY-hh:mma")))                    
                    continue;                
                
                let players = [];
                for (let j = 0; j < docs[i].users.length; j++)
                    players.push(msg.channel.server.members.get("id",docs[i].users[j].id).username);
                
                let response = `Session: ${docs[i].name}\n players: ${players.join(", ")}\n Date: ${docs[i].date._i}`;
                bot.sendMessage(msg.channel,response);
                available++;
            }
            // if (available>0){
            //     bot.sendMessage(msg.channel,`Si quieres jalarte a una, escribe !join <session name>`);
            // }
        })
    }
}