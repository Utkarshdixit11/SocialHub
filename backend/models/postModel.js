import mongoose from "mongoose";

// Post schema - pretty straightforward
const postSchema = new mongoose.Schema({
    name: { type: String, required: true }, // author name
    content: { type: String, required: true, maxlength: 500 },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: [{
        text: { type: String, required: true },
        author: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    likedBy: [{ type: String }], // array of user IDs who liked this post
    // TODO: add tags/categories later
    // TODO: maybe add image support?
}, {
    timestamps: true // this adds createdAt and updatedAt automatically
})

const Post = mongoose.models.post || mongoose.model("post", postSchema)

export default Post;
