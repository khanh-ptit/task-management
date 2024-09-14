const mongoose = require("mongoose")

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Successfully connected")
    } catch (error) {
        console.log("Connect error")
    }
}

// khanhhs11vtt
// abWffnwFZxaMLjz1