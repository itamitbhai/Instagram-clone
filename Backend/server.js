// require('dotenv').config();
// const app = require("./src/app")
// const connectToDB = require("./src/config/database")


// connectToDB()


// app.listen(3000, () => {
//     console.log("server is start on port 3000")
// })

require('dotenv').config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");

// ✅ NEW
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./src/socket/socket");

// DB connect
connectToDB();

// ✅ create server
const server = http.createServer(app);

// ✅ socket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// ✅ run socket
socketHandler(io);

// ❌ old:
// app.listen(3000)

// ✅ new:
server.listen(3000, () => {
  console.log("Server running on port 3000");
});