import { connect } from "mongoose"
import { config } from "dotenv"

config()
const connectDB = async () => {
    try {
        const URI = process.env.URI_DB
        await connect(URI)
        console.log('Successfull conection to MongoDB')
    } catch (error) {
        console.log(`Error trying to connect to MongoDB: ${error.message}`)
    }
}

export { connectDB }