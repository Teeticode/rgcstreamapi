const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI

const connectToMongo= async()=>{
    try{
        const connection = await mongoose.connect(MONGO_URI,{
            dbName:'rgcstreamapp',
        });
        if(connection){
            console.log('connected to rgc stream service')
        }else{
            console.log('no connection is established')
        }

    }catch(err){
        console.error(`Error is ${err.message}`)
        process.exit(1)
    }
}
module.exports = connectToMongo