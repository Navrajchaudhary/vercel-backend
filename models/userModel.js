const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profile: {
        profilePic: {
            type: String,
            default: null
        },
        bio: {
            type: String,
            default: null,
            maxlength: 160
        },
        address: {
            type: String,
            default: null
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}


const userModel = mongoose.model("user", userSchema)
module.exports = userModel