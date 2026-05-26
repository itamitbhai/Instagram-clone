let onlineUsers = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // add user
    socket.on("addUser", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log("Online Users:", onlineUsers);
    });

    // sendMessage
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

    // ✅ NOTIFICATION — like, follow, comment
    socket.on("sendNotification", (data) => {
      // data = { receiverId, senderId, senderUsername, type, postId? }
      const receiverSocket = onlineUsers[data.receiverId];

      if (receiverSocket) {
        io.to(receiverSocket).emit("getNotification", {
          senderId:       data.senderId,
          senderUsername: data.senderUsername,
          type:           data.type,       // "like" | "follow" | "comment" | "message"
          postId:         data.postId || null,
          createdAt:      new Date(),
          isRead:         false,
        });
      }
    });

    // disconnect
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