import { connect } from "mongoose"
import { config } from "dotenv"
import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"

config()

// This script will be run when the app starts to add on the database the initial values of the admin
// so everyone who log in with the correct credentials will have admin permissions.
// Before running the project it is necessary to run this script.

const createAdmin = async () => {
    try {
        const URI = process.env.URI_DB
        await connect(URI)
        console.log('Successfull conection to MongoDB')

        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL })
        if (existingAdmin) {
            console.log('Admin already exists on database')
            process.exit(0) // Admin exists on database so it´s not necessary to run this script. 
            // The process finish with a successfull code.
        }

        const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
        const adminData = {
            username: 'admin',
            email: process.env.ADMIN_EMAIL,
            password: hashPassword,
            role: 'admin'
        }
        const newAdmin = await User.create(adminData)
        await newAdmin.save()

        console.log('Admin was created successfully')
        process.exit(0)
    } catch (error) {
        console.log(`Error trying to connect to MongoDB: ${error.message}`)
        process.exit(1)
    }
}

createAdmin()