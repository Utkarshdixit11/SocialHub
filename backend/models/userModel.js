import mongoose from "mongoose";

// User schema definition
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    // keeping this for backward compatibility - might remove later
    postData: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { minimize: false, timestamps: true })

// Create the model
const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;