import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import { emailValidator, existingFields, passwordValidator, verifyDataLength } from "../services/helpers.js"

config()

const register = async (req, res) => {
    try {
        const { body } = req
        const { username, email, password, degree, biography } = body
        const hashPassword = await bcrypt.hash(password, 10)

        if (!existingFields({ username, email, password })) { //A function defined on 'helpers.js' that verify if the user wrote all of the required fields.
            return res.status(400).json({
                success: false,
                error: 'Username, email and password are required'
            })
        }

        if (!emailValidator(email)) { // Validates if the email ends with '@gmail.com'.
            return res.status(400).json({
                success: false,
                error: 'Email must includes @gmail.com'
            })
        }

        if (!verifyDataLength(username)) {
            return res.status(400).json({
                success: false,
                error: 'Username must includes at least 3 words'
            })
        }

        if (!passwordValidator(password)) { // Verify if the password includes the characters required.
            return res.status(400).json({
                success: false,
                error: 'Password must includes at least 3 words, a number, an uppercaso and a lowercase'
            })
        }

        // Analyze if the user had already been registered.
        const registeredUser = await User.findOne({ email })
        if (registeredUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists'
            })
        }

        const newUserData = {
            username,
            email,
            password: hashPassword,
            degree
        }

        if (biography) {
            newUserData.biography = biography
        }

        const newUser = await User.create(newUserData)

        let publicData = {
            username: newUser.username,
            email: newUser.email,
            degree: newUser.degree,
            biography: newUser.biography
        }

        // Token generation.
        const payload = {
            ...publicData,
            id: newUser._id,
            role
        }

        const secretKey = process.env.JWT_SECRET
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })
        publicData = { ...publicData, token }

        res.status(201).json({ success: true, data: publicData, message: 'User created succesfully' })

    } catch (error) {
        console.log(error)
        res.status(409).json({
            success: false,
            error: `Error - ${error._message || error.message}`
        })
    }
}

const login = async (req, res) => {
    try {
        const { body } = req
        const { email, password } = body

        if (!email || !password) {
            res.status(409).json({
                sucess: false,
                error: 'Unauthorized - Email and password are required'
            })
        }

        const loggedUser = await User.findOne({ email })
        if (!loggedUser) {
            res.status(409).json({
                sucess: false,
                error: 'Unauthorized - The user does not exist or the email is wrong'
            })
        }

        const isValid = await bcrypt.compare(password, loggedUser.password)
        if (!isValid) {
            res.status(409).json({
                sucess: false,
                error: 'Unauthorized - The password is wrong'
            })
        }

        let publicData = {
            email: loggedUser.email
        }

        const payload = {
            ...publicData,
            id: loggedUser._id,
            role: loggedUser.role
        }

        const secretKey = process.env.JWT_SECRET
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })
        publicData = { ...publicData, token }

        console.log(loggedUser.role)

        res.status(201).json({
            success: true,
            data: publicData,
            message: 'User logged succesfully'
        })

    } catch (error) {
        console.log(error)
        res.status(409).json({
            success: false,
            error: 'Unauthorized'
        })
    }
}

export { register, login }