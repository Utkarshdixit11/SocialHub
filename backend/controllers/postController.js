import Post from "../models/postModel.js";

// create a new post
const createPost = async (req, res) => {
    try {
        const { name, content } = req.body;

        // basic validation
        if (!name || !content) {
            return res.json({ success: false, message: "Name and content are required" })
        }

        const newPost = new Post({
            name,
            content,
        })

        const savedPost = await newPost.save();
        res.json({
            success: true,
            message: "Post created successfully",
            data: savedPost
        })
    } catch (error) {
        console.log("Error creating post:", error)
        res.json({ success: false, message: "Failed to create post" })
    }
}

// get all posts - maybe add pagination later
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ date: -1 }); // newest first
        res.json({ success: true, data: posts })
    } catch (error) {
        console.log("Error fetching posts:", error);
        res.json({ success: false, message: "Failed to fetch posts" });
    }
}

export { createPost as addPost, getAllPosts as listpost }