import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login functionality
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" })
        }

        // check password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid password" })
        }

        // create token and send response
        const token = generateToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log("Login error:", error);
        res.json({ success: false, message: "Something went wrong" })
    }
}
// helper function to create JWT tokens
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// register new user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validate email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // hash the password
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })

        const savedUser = await newUser.save()
        console.log('User registered:', savedUser._id)

        const token = generateToken(savedUser._id)

        res.json({
            success: true,
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ success: false, message: "Registration failed: " + error.message })
    }
}

// simple test endpoint - probably should remove this in production
const testEndpoint = (req, res) => {
    res.json({
        success: true,
        message: "Server is working",
        timestamp: new Date().toISOString()
    })
}

export { loginUser, registerUser, testEndpoint }