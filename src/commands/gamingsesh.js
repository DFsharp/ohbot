import sessions from '../data/sessions';
import ArgumentParser from "argument-parser-extended";
import nconf from 'nconf';
import moment from 'moment';
import R from 'ramda';


moment.locale('es');
export default {
    create_session:(msg, suffix) => {
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

        let argParser = new ArgumentParser('sesh', options);
        let res = {};
        try {
            res = argParser.parse(suffix);
        } catch (e) {
            let helpStr = argParser.getHelpString();
            msg.channel.send(e);
            return;
        }

        let sesh = {
            name: res.name,
            users: [],
            date: moment(res.date,"DD/MM/YYYY-hh:mma"),
            recurring: res.recurring,
            server: msg.channel.guild.id,
            description: res.description
            };

            if (!sesh.date.isValid()) return;
            //console.log(sesh.date.format("DD/MM/YYYY-hh:mma"));
            sessions.addSesh(sesh,(err, res)=>{
                if (err || !res) {
                msg.channel.send(err);
                return;
                }
                else
                    msg.channel.send(`Se creó la sesión ${sesh.name}. Si quieres unirte, escribe: !join ${sesh.name}`);
            });

    },
    join_session:(msg, suffix) => {
        if (!suffix) return;
        let user = {id:msg.author.id, remind:true};
        try {
        sessions.addUserToSesh({name: suffix}, {id:msg.author.id, remind:true}, (err, res)=>{
            if (err){
                msg.channel.send(err);
                return;
            }
            if (!res.value) return;
            if(!R.findIndex(R.propEq('id',user.id))(res.value.users))
                msg.channel.send(`Ya estabas inscrito, che ${msg.author.username}.`);

            else
                msg.channel.send(`Se agregó ${msg.author.username} a la sesión ${suffix}.`);
        });
        }
        catch (e){
            //console.log(e);
        }
    },
    leave_session:(msg, suffix) => {
        if (!suffix) return;
        let userId = msg.author.id;
        sessions.removeUserFromSesh({name:suffix}, userId ,(err, res) => {
            if (err){
                msg.channel.send(err);
                return;
            }
            if (!res.value) return;
            if(R.findIndex(R.propEq('id',userId))(res.value.users))
                msg.reply(`no estabas inscrito en la sesión ${suffix}.`);
            else
                msg.channel.send(`Se eliminó ${msg.author.username} de la sesión ${suffix}.`);

        });
    },
    remind:(msg, suffix) =>{
        if (!suffix) return;
        sessions.getSession({name:suffix, server:msg.guild.id}, (err, res) => {
            if (res == null) return;

            let date = moment(res.date._i,"DD/MM/YYYY-hh:mma");
            let now = moment();
            if (now.isAfter(date)) return;
            if (err || !res) return;
            for (var i = 0; i < res.users.length; i++) {
                var user = res.users[i];
                if (!user.remind) continue;
                //TODO: remove reminders optional
                let message = `te recuerdo que hay una gaming session el ${date.format("DD/MM/YYYY")} a las ${date.format("hh:mma")}\n o sea, ${date.from(now)}.`;
                msg.reply(message);
            }

        });
    },
    sessions:(msg, suffix) =>{
        if (msg.channel.isPrivate) return;
        sessions.getAllSessions(msg.guild.id, (err, docs)=>{
            if (err) return;

            let available = 0;
            for (let i = 0; i < docs.length; i++){
                if(moment().isAfter(moment(docs[i].date._i,"DD/MM/YYYY-hh:mma")))
                    continue;

                let players = [];
                for (let j = 0; j < docs[i].users.length; j++)
                    players.push(msg.guild.members.get("id", docs[i].users[j].id).username);

                let response = `Session: ${docs[i].name}\n players: ${players.join(", ")}\n Date: ${docs[i].date._i}`;
                msg.channel.send(response);
                available++;
            }
            if (available > 0){
                msg.channel.send(msg.channel,`Si quieres jalarte a una, escribe !join <session name>`);
            }
        })
    }
}

export const help = {
  create_session: "!createsession --name <name> --date <DD/MM/YYYY-HH:MMpm/am>",
  join_session: "!join <session name>",
  leave_session: "!leave <session name>",
  remind:"!remind <session name>"
}
