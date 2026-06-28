import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import { emailValidator, existingFields, passwordValidator, verifyDataLength } from "../services/helpers.js"
import { loginSchema, registerSchema } from "../services/validations.js"

config()

const register = async (req, res) => {
    try {
        const { body } = req
        const { username, email, password, degree, biography } = body
        const hashPassword = await bcrypt.hash(password, 10)

        const validatedData = registerSchema.safeParse(body)
        if (!validatedData.success) {
            return res.status(400).json({
                success: false,
                error: 'Some fields are incorrect'
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
            role: 'user'
        }

        const secretKey = process.env.JWT_SECRET
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })
        publicData = { ...publicData, token }

        return res.status(201).json({ success: true, data: publicData, message: 'User created succesfully' })

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
            return res.status(409).json({
                sucess: false,
                error: 'Unauthorized - Email and password are required'
            })
        }

        const validatedLogIn = loginSchema.safeParse(body)
        if (!validatedLogIn) {
            return res.status(400).json({
                success: false,
                error: 'Some fields are incorrect'
            })
        }

        const loggedUser = await User.findOne({ email })
        if (!loggedUser) {
            return res.status(409).json({
                sucess: false,
                error: 'Unauthorized - The user does not exist or the email is wrong'
            })
        }

        const isValid = await bcrypt.compare(password, loggedUser.password)
        if (!isValid) {
            return res.status(409).json({
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

        return res.status(201).json({
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