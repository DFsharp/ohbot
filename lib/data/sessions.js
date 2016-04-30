import MongoClient from "mongodb";
import nconf from "nconf";

function addSesh(sesh, cb){
     MongoClient.connect(nconf.get("MONGODB_URL"),(err, db)=>{         
         let collection = db.collection("sessions");
         let options = {};
         //collection.findOneAndModify({name:sesh.name},[],sesh,options)
         collection.insertOne(sesh,(err, result)=>{
             if (result) console.log(`Successfully inserted session`);    
         });
         db.close();
     });
     cb(null,"");
 };
 
 function getSesh(name, options, cb){
     MongoClient.connect(nconf.get("MONGODB_URL"), (err, db)=>{
         let collection = db.collection("sessions");
         collection.findOne(name, options, (err, result)=>{
            cb(null,result);              
         })
     });
 };
 
function addUserToSesh(sesh,userId,cb){
    MongoClient.connect(nconf.get("MONGODB_URL"),(err, db)=>{
        let collection = db.collection("sessions");
        collection.findOneAndUpdate(sesh,{$addToSet:{users:userId}},(err, res)=>{
        if (err) cb(err,null);
            db.close();
            cb(null,res);
        });
    });
     
};
    
export default {
    addSesh,
    getSesh,
    addUserToSesh
};
