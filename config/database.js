const mongoose = require("mongoose")



const connectDatabase = () => {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.MONGO).then((data) => {
        console.log(`mongodb connected with the server: ${data.connection.host}`)
    })
}

module.exports = connectDatabase