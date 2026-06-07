import { Schema, model } from "mongoose"

const articleSchema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    text: { type: String, required: true, minlength: 3 },
    like: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    versionKey: false,
    timestamps: true
})

const Article = model('article', articleSchema)

export { Article }