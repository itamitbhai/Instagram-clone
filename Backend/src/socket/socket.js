let onlineUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    //  add user
    socket.on("addUser", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log("Online Users:", onlineUsers);
    });

    //  FIXED sendMessage
    socket.on("sendMessage", (data) => {
      const receiverSocket = onlineUsers[data.receiverId];

      const messageData = {
        senderId: data.senderId,
        text: data.text,
        conversationId: data.conversationId,
        createdAt: new Date(),
      };

      if (receiverSocket) {
        io.to(receiverSocket).emit("getMessage", messageData);
      }
    });

    //  disconnect
    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
        }
      }
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;