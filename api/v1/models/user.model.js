const mongoose = require("mongoose")
const generate = require("../../../helpers/generate")

const userSchema = new mongoose.Schema({
    fullName: String,
    password: String,
    email: String,
    token: {
        type: String,
        default: () => generate.generateRandomString(30) // Sử dụng callback
    },
    status: {
        type: String,
        default: "initial"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema, "users")

module.exports = User