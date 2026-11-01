const mongoose = require('mongoose')

const connectDB = async()=> {
    const mongoUri = process.env.MONGO_URI
    try{
        await mongoose.connect(`${mongoUri}MiniFaceBook`)
        console.log("Database Connected Successfully")
    }catch(error){
        console.log(error.message)
    }
}

module.exports = connectDB