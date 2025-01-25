const mongoose=require('mongoose');

const stdSchema= new mongoose.Schema({
    fname:{
        type: String,
        required:true
    },   lname:{
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },password:{
        type:String,
        required:true,
    },  pic:{
        type:String,
    }, isVerified:{
        type: Boolean,
        default:false
    }, verficationToken:String,
    verficationTokenExpiresAt:Date,
    }
,{timestamps:true})

const std= mongoose.model('std',stdSchema);
module.exports=std;