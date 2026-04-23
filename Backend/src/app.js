const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require("cors")


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))

// require Routes
const authRouter =require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const userRouter = require("./routes/user.routes")

const messageRouter = require("./routes/message.routes");
const conversationRouter = require("./routes/conversation.routes");



// using Routes

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/users", userRouter)

app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);

module.exports = app
