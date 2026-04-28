import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../../socket";
import { useAuth } from "../../auth/hooks/useAuth";
import { useLocation } from "react-router-dom";
import "../style/message.scss";

const Message = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef();

  // PROFILE → MESSAGE AUTO OPEN (🔥 MAIN FIX)
  useEffect(() => {
    if (location.state?.conversation) {
      console.log("🔥 Received from profile:", location.state.conversation);

      setCurrentChat(location.state.conversation);

      // optional: add in list
      setConversations((prev) => {
        const exists = prev.find(
          (c) => c._id === location.state.conversation._id
        );
        return exists ? prev : [location.state.conversation, ...prev];
      });
    }
  }, [location.state]);

  //  socket register
  useEffect(() => {
    if (!userId) return;
    socket.emit("addUser", userId);
  }, [userId]);

  //  get conversations
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3000/api/conversations/${userId}`)
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.log(err));
  }, [userId]);

  //  get messages
  useEffect(() => {
    if (!currentChat?._id) return;

    axios
      .get(`http://localhost:3000/api/messages/${currentChat._id}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.log(err));
  }, [currentChat]);

  //  socket receive 
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("getMessage");
  }, []);

  //  auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const receiverId = currentChat.members?.find(
      (m) => String(m) !== String(userId)
    );

    if (!receiverId) {
      console.log(" receiverId not found");
      return;
    }

    const payload = {
      senderId: userId,
      receiverId,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/messages",
        payload
      );

      socket.emit("sendMessage", payload);

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  if (!userId) return <div>Loading...</div>;

  return (
    <div className="messagePage">
      
      {/* LEFT */}
      <div className="chatList">
        <h3>Chats</h3>

        {conversations.map((c) => {
          const otherUser = c.members?.find(
            (m) => String(m) !== String(userId)
          );

          return (
            <div
              key={c._id}
              onClick={() => setCurrentChat(c)}
              className={`chatItem ${
                currentChat?._id === c._id ? "active" : ""
              }`}
            >
              {otherUser}
            </div>
          );
        })}
      </div>

      {/* RIGHT */}
      <div className="chatBox">

        {currentChat ? (
          <>
            <div className="chatHeader">
              Chat
            </div>

            <div className="messages">
              {messages.map((m) => (
                <div
                  ref={scrollRef}
                  key={m._id}
                  className={
                    String(m.senderId) === String(userId)
                      ? "message own"
                      : "message"
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="inputBox">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="noChat">Select a chat</div>
        )}
      </div>
    </div>
  );
};

export default Message;