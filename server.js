const app = require("./app")
var cors = require('cors')
const dotenv = require('dotenv')
const coloudinary = require("cloudinary")
app.use(cors())
const connectDatabase = require("./config/database")
dotenv.config({ path: "backend/config/config.env" })

process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`)
    console.log("uncaught Error")
    process.exit(1)
})

//connection to database
connectDatabase()
coloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(5000, () => {
    console.log("backend server is running")
})


// unhandle promise error
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`)
    console.log("shutting down the server")

    server.close(() => {
        process.exit(1)
    })
})