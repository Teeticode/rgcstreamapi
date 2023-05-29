const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
   
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    image:{
        type:String
    },
    token:{
        type:String
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video'
    }]

},{
    timestamps:true
});


const User = mongoose.model('User',userSchema);
module.exports = User;