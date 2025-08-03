// Simple test script to verify registration works
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "dotenv/config";

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
};

const testRegistration = async () => {
    await connectDB();
    
    try {
        const testUser = {
            name: "Test User Direct",
            email: "testdirect@example.com",
            password: "testpass123"
        };
        
        console.log("Testing user registration...");
        
        // Check if user exists
        const exists = await userModel.findOne({email: testUser.email});
        if (exists) {
            console.log("User already exists, deleting...");
            await userModel.deleteOne({email: testUser.email});
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        
        // Create user
        const newUser = new userModel({
            name: testUser.name,
            email: testUser.email,
            password: hashedPassword,
        });
        
        const user = await newUser.save();
        console.log("User saved successfully:", user._id);
        
        // Create token
        const token = createToken(user._id);
        console.log("Token created successfully");
        
        console.log("Registration test completed successfully!");
        
        // Test login
        console.log("\nTesting login...");
        const loginUser = await userModel.findOne({email: testUser.email});
        const isMatch = await bcrypt.compare(testUser.password, loginUser.password);
        
        if (isMatch) {
            console.log("Login test successful!");
        } else {
            console.log("Login test failed!");
        }
        
    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        mongoose.connection.close();
    }
};

testRegistration();
