import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import "dotenv/config"
import postRoutes from "./routes/postRouter.js"
import userRoutes from "./routes/userRouter.js"

// basic express setup
const app = express()
const PORT = process.env.PORT || 4000;

// middleware stuff
app.use(express.json())
app.use(cors()) // TODO: configure this properly for production

// connect to database
connectDB();

// routes
app.use("/api/post", postRoutes)
app.use("/api/user", userRoutes)

// basic health check
app.get("/", (req, res) => {
    res.send("route is working ")
})

app.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`)
})
