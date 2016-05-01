import nconf from "nconf";
import MongoClient from "mongodb";


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
                                    (err, result)=>{
            if (result.value){
              console.log(`A session already exists: ${result.value}`);
              cb("Ya existe una sesión con ese nombre", null);
              return;
            } 
            else{
                console.log(`A new session was created: ${result.value.name}`);
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

function getAllSessions(cb) {   
        let collection = db.collection('sessions');
        collection.find({}).toArray((err, docs)=>{
            cb(null,docs);            
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
            db.close();
            cb(null, res);
        });
};


export default {
    addSesh,
    getSession,
    addUserToSesh,
    getAllSessions
};