const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    featuring:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    video:{
        type:String,
        require:true
    },
    poster:{
        type:String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }
},{
    timestamps:true
})

const Video = mongoose.model('Video', videoSchema)
