import z from "zod"

const articleSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    subtitle: z.string().trim().min(1, 'Subtitle is required'),
    text: z.string().trim().min(3, 'Text min length is 3 characters'),
    like: z.boolean().optional(),
    category: z.string().trim().optional(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

export { articleSchema }