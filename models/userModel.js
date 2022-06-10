const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name!'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Please enter your email!'],
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please enter your password!']
        },
        role: {
            type: Number,
            default: 0 // 0 = user, 1 = admin
        }
    },

    {
        timestamps: true
    }
)
userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
userSchema.set('toJSON', {
    virtuals: true
})
module.exports = mongoose.model('Users', userSchema)
