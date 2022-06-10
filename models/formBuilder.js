const mongoose = require('mongoose')
const FormBuilderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    formData: {
        type: JSON,
        required: true
    }
})
FormBuilderSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
FormBuilderSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('FormBuilder', FormBuilderSchema)
