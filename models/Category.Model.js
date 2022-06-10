const mongoose = require('mongoose')


const CategorySchema = new mongoose.Schema({
    name : {
        type :String ,
        required : false ,
        unique :false
    },
    image : {
        type : String,
        required : true
    },
    formId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FormBuilder',
    }
})

module.exports = mongoose.model("Category", CategorySchema)