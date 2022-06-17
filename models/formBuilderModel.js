const mongoose = require('mongoose')
const FormBuilderSchema = new mongoose.Schema(
    {
        formData: { type: mongoose.Schema.Types.Mixed }
    },
    { collection: 'formBuilder' }
)
FormBuilderSchema.virtual('formId').get(function () {
    return this._id.toHexString()
})
FormBuilderSchema.set('toJSON', {
    virtuals: true
})
const formBuilderModel = mongoose.model('formBuilder', FormBuilderSchema)
module.exports = formBuilderModel
