const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "https://instagram-clone-4q13.onrender.com"
    ],
    credentials: true
}));

// require Routes
const authRouter =require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const userRouter = require("./routes/user.routes")

const messageRouter = require("./routes/message.routes");
const conversationRouter = require("./routes/conversation.routes");

const storiesRouter = require("./routes/stories.routes");
const reelsRouter = require("./routes/reels.routes");


// using Routes

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/uploads", express.static("uploads"))

// Routes mount karo
app.use("/api/stories", storiesRouter);
app.use("/api/reels", reelsRouter);


module.exports = app
