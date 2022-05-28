const mongoose = require('mongoose')
const FormBuilderSchema = new mongoose.Schema({
      name: {
        type: String,
        required : true
      },
      formData: {
        type: JSON,
        required: true
      }
    }
)

module.exports = mongoose.model("FormBuilder", FormBuilderSchema)