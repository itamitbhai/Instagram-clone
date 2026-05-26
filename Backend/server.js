
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
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true
  }
});

// ✅ run socket
socketHandler(io);

// ✅ new:
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});