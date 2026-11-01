const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true
    },
    tokenType: {
        type: String,
        required: true,
        enum: ["EMAIL_VERIFICATION", "PASSWORD_RESET"]
    },
    expireAt: {
        type: Date,
        required: true
    }

}, { timestamps: true })

tokenSchema.index(
    { expireAt: 1 },
    { expireAfterSeconds: 0 }
)

const tokenModel = mongoose.model("token", tokenSchema)
module.exports = tokenModel