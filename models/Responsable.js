const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const responsableschema = new Schema({
    name :{
        type:String ,
        required: true
    },
    prenom : {
        type : String,
        required: false
    },
    email : {
        type : String,
        required : true
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
    },
    password : {
        type : String,
        required : true  
    },
   
} ,
{
        timestamps: true
    })
module.exports=mongoose.model('utilisateurs',responsableschema);