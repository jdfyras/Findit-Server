const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: false
    },
    image: {
        type: String,
        required: true
    },
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'formBuilder'
    }
})
CategorySchema.virtual('id').get(function () {
    return this._id.toHexString()
})
CategorySchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('Category', CategorySchema)
