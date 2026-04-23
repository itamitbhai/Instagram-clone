let onlineUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (userId) => {
      onlineUsers[userId] = socket.id;
    });

    socket.on("sendMessage", (data) => {
      const receiverSocket = onlineUsers[data.receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("getMessage", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;