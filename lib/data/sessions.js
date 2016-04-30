import MongoClient from "mongodb";
import nconf from "nconf";

let db;
MongoClient.connect("mongodb://localhost:27017/ohbot", (err, dbs) => {
    db = dbs;
});

function addSesh(sesh, cb) {   
        let collection = db.collection("sessions");
        let options = {};
        collection.insertOne(sesh, (err, result) => {
            if (result) console.log(`Successfully inserted session`);
            cb(null, result);
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