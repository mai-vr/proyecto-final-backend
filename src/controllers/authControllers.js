import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "dotenv"

config()

const register = async (req, res) => {
    try {
        const { body } = req
        const { username, email, password, degree } = body
        const hashPassword = await bcrypt.hash(password, 10)

        // Analyze if the user had already been registered.
        const registeredUser = await User.findOne({ email })
        if (registeredUser) {
            res.status(409).json({
                success: false,
                error: 'User already exists'
            })
        }

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
            degree
        })

        newUser.save()

        const publicData = {
            username: newUser.username,
            email: newUser.email,
            degree: newUser.degree
        }

        // Token generation.
        const payload = {
            ...publicData,
            id: newUser._id
        }

        const secretKey = process.env.JWT_SECRET
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

        res.status(201).json({ token })

    } catch (error) {
        console.log(error)
        res.status(409).json({
            success: false,
            error: 'User already exists'
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
                error: 'Unauthorized'
            })
        }

        const loggedUser = await User.findOne({ email })
        if (!loggedUser) {
            res.status(409).json({
                sucess: false,
                error: 'Unauthorized'
            })
        }

        const isValid = await bcrypt.compare(password, loggedUser.password)
        if (!isValid) {
            res.status(409).json({
                sucess: false,
                error: 'Unauthorized'
            })
        }

        const publicData = {
            email: loggedUser.email,
            password: loggedUser.password
        }

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