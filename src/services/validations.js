import z from "zod"

const ROLES = ['user', 'admin']

const registerSchema = z.object({
    username: z.string().trim().min(3, 'Username min length is 3 characters').max(30, 'Username max length is 30 characters'),
    email: z.string().trim().toLowerCase().email('Email format is not valid').min(3, 'Email min length is 3 characters').max(30, 'Email max length is 30 characters'),
    password: z.string().min(4, 'Password min length is 4 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/), // Password must includes uppercase, lowercase and a number.
    degree: z.string().trim().optional(),
    biography: z.string().min(10).optional(),
    role: z.enum(ROLES).default('user')
})

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email('Email is not valid'),
    password: z.string().min(4)
})

export { registerSchema, loginSchema }