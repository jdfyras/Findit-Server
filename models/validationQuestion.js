const mongoose = require('mongoose')

const validationQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    lostObject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Object'
    },
    foundObject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Object'
    },
    dateTime: { type: Date, default: Date.now }
})
validationQuestionSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
validationQuestionSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('validationQuestion', validationQuestionSchema)
