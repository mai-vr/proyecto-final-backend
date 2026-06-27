import { Schema, model } from "mongoose"

const ROLES = ['user', 'admin']

const userSchema = new Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, minlength: 3, maxlength: 30, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    password: { type: String, required: true, minlength: 3 },
    degree: { type: String },
    biography: { type: String, minlength: 10 },
    role: { type: String, enum: ROLES, default: 'user' }
}, {
    versionKey: false,
    timestamps: true
})

const User = model('user', userSchema)

export { User }