
require('dotenv').config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");
const { startStoryCleanupJob } = require("./src/jobs/storyCleanup");

// ✅ NEW
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./src/socket/socket");

// DB connect
connectToDB().then(startStoryCleanupJob);

// ✅ create server
const server = http.createServer(app);

// ✅ socket setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
      "http://localhost:5175",
      "http://127.0.0.1:5175",
      "https://instagram-clone-4q13.onrender.com"
    ],
    methods: ["GET", "POST"],
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