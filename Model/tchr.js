const mongoose=require('mongoose');

const tchrSchema= new mongoose.Schema({
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
    },
    role:{
        type:String,
        required:true
    }
    
    
    ,password:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
    }
    ,isVerified:{
        type: Boolean,
        default:false
    }, verficationToken:String,
    verficationTokenExpiresAt:Date,
    }
,{timestamps:true})

const tchr= mongoose.model('tchr',tchrSchema);
module.exports=tchr;