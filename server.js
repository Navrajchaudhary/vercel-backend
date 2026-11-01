require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./config/database')

const Port = process.env.PORT || 5000


app.listen(Port, ()=> {
    connectDB()
    console.log(`Server is running on port ${Port}`)
})