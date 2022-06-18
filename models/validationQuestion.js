const mongoose = require('mongoose')

const validationQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    refMatching: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'matchings'
    },

    dateTime: { type: Date, default: Date.now }
})
validationQuestionSchema.virtual('questionId').get(function () {
    return this._id.toHexString()
})
validationQuestionSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('validationQuestion', validationQuestionSchema)
