const mongoose = require('mongoose')

const objectSchema = new mongoose.Schema({
    statut: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    objectDate: {
        type: Date,
        required: true
    },
    refCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    refUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    formInput: { type: mongoose.Schema.Types.Mixed },
    dateTime: { type: Date, default: Date.now }
})
objectSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
objectSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('objects', objectSchema)
