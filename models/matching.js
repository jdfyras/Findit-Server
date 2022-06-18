const mongoose = require('mongoose')

const matchingSchema = new mongoose.Schema({
    results: { type: mongoose.Schema.Types.Mixed },
    lostObject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'objects'
    },
    foundObject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'objects'
    },
    dateTime: { type: Date, default: Date.now }
})
matchingSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
matchingSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('matchings', matchingSchema)
