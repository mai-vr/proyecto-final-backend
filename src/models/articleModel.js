import { Schema, model } from "mongoose"

const articleSchema = new Schema({
    title: { type: String, required: true, minlength: 5 },
    subtitle: { type: String, minlength: 5 },
    text: { type: String, required: true, minlength: 3 },
    uploadDate: { type: Date, default: Date.now() },
    like: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    versionKey: false,
    timestamps: true
})

const Article = model('article', articleSchema)

export { Article }