import nconf from "nconf";
import MongoClient from "mongodb";
import moment from 'moment';


let db;
MongoClient.connect(nconf.get("MONGODB_URL"), (err, dbs) => {
    if (err){
        console.log('error connecting to mongo Db. Exiting');
        process.exit(1);
    }
    db = dbs;
});

function addSesh(sesh, cb) {
        let collection = db.collection("sessions");        
        collection.findOneAndUpdate({name:sesh.name},
                                    {$setOnInsert :sesh},
                                    {upsert:true},
                                    (err, result) => {
            if (result.value){
              console.log(`A session already exists: ${result.value}`);
              if (!moment(sesh.date).isSame(moment(result.value.date,"DD/MM/YYYY-hh:mma"))){
                  collection.findOneAndUpdate({name:sesh.name},{$set:{date:sesh.date}});
                  console.log(`Date updated for ${sesh.name}`);
                  cb(`Se actualizó la fecha de ${sesh.name}`, null);
                  return;
              }              
              cb("Ya existe una sesión con ese nombre", null);
              return;
            } 
            else{
                console.log(`A new session was created: ${sesh.name}`);
                cb(null, result);
            }
        });  
};

function getSession(query, cb) {    
        let collection = db.collection("sessions");
        collection.findOne(query, (err, result) => {            
            cb(err, result);
        });
};

function getAllSessions(serverId,cb) {   
        let collection = db.collection('sessions');
        collection.find({server:serverId}).toArray((err, docs)=>{
            cb(err,docs);            
        });
};

function addUserToSesh(sesh, user, cb) {    
        let collection = db.collection("sessions");
        collection.findOneAndUpdate(sesh, {
            $addToSet: {
                users: user
            }
        }, (err, res) => {
            if (err) cb(err, null);            
            cb(null, res);
        });
};

function removeUserFromSesh(sesh, userId, cb) {
    let collection = db.collection('sessions');
    collection.findOneAndUpdate(sesh, {
        $pull:{
            users:{id:userId}
        }
    }, (err, res)=>{
        if (err) cb(err, null);            
            cb(null, res);
    });
};


export default {
    addSesh,
    getSession,
    addUserToSesh,
    removeUserFromSesh,
    getAllSessions
};