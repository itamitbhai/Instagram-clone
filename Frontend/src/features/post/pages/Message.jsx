import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../../socket";
import { useAuth } from "../../auth/hooks/useAuth";
import { useLocation } from "react-router-dom";
import "../style/message.scss";


const Message = () => {
  const { user } = useAuth();
  const userId = user?._id;

  // 🔥 ADD THESE STATES + FUNCTIONS (TOP में userId के नीचे)

const [activeMsg, setActiveMsg] = useState(null);
const pressTimer = useRef(null);

const handlePressStart = (id) => {
  pressTimer.current = setTimeout(() => {
    setActiveMsg(id);
  }, 500);
};

const handlePressEnd = () => {
  clearTimeout(pressTimer.current);
};

// 🔥 AUTO CLOSE MENU
useEffect(() => {
  const closeMenu = () => setActiveMsg(null);
  window.addEventListener("click", closeMenu);
  return () => window.removeEventListener("click", closeMenu);
}, []);

  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef();

  //  AUTO OPEN CHAT FROM PROFILE
  useEffect(() => {
    if (location.state?.conversation) {
      const conv = location.state.conversation;

      setCurrentChat(conv);

      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conv._id);
        return exists ? prev : [conv, ...prev];
      });
    }
  }, [location.state]);

  //  SOCKET REGISTER
  useEffect(() => {
    if (!userId) return;
    socket.emit("addUser", userId);
  }, [userId]);

  //  GET CONVERSATIONS
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3000/api/conversations/${userId}`)
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.log("Conversation Error:", err));
  }, [userId]);

  //  GET MESSAGES
  useEffect(() => {
    if (!currentChat?._id) return;

    axios
      .get(`http://localhost:3000/api/messages/${currentChat._id}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.log("Message Fetch Error:", err));
  }, [currentChat]);

  // SOCKET RECEIVE MESSAGE
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("getMessage");
  }, []);

  //  SOCKET TYPING
  useEffect(() => {
    socket.on("typing", () => {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);
      }, 1500);
    });

    return () => socket.off("typing");
  }, []);

  //  AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  SEND MESSAGE
  const sendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const receiverUser = currentChat?.members?.find(
      (m) => String(m?._id || m) !== String(userId)
    );

    const receiverId = receiverUser?._id || receiverUser;

    if (!receiverId) return;

    const payload = {
      senderId: userId,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/api/messages",
        payload
      );

      socket.emit("sendMessage", {
        ...payload,
        receiverId,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("❌ Send Error:", err.response?.data || err.message);
    }
  };

  // 🗑 DELETE MESSAGE
  const deleteMessage = async (msgId, type = "me") => {
  try {
    if (type === "everyone") {
      await axios.delete(
        `http://localhost:3000/api/messages/${msgId}`,
        {
          withCredentials: true, // 👈 FIX
        }
      );

      // 🔥 socket notify (optional but recommended)
      socket.emit("deleteMessage", { messageId: msgId });

    } else {
      // optional: delete only for me (if backend supports)
      await axios.put(
        `http://localhost:3000/api/messages/delete-for-me/${msgId}`,
        { userId },
        {
          withCredentials: true, // 👈 FIX
        }
      );
    }

    // UI update
    setMessages((prev) => prev.filter((m) => m._id !== msgId));

  } catch (err) {
    console.log("Delete Msg Error:", err.response?.data || err.message);
  }
};

  // 💣 DELETE CHAT
  const deleteChat = async () => {
    if (!currentChat) return;

    if (!window.confirm("Delete entire chat?")) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/conversations/${currentChat._id}`,
        {
          withCredentials:true,
        }
      );

      setConversations((prev) =>
        prev.filter((c) => c._id !== currentChat._id)
      );

      setCurrentChat(null);
      setMessages([]);
    } catch (err) {
      console.log("Delete Chat Error:", err);
    }
  };

  if (!userId) return <div>Loading...</div>;

  const chatUser = currentChat?.members?.find(
    (m) => String(m?._id || m) !== String(userId)
  );

  return (
    <div className={`messagePage ${currentChat ? "chatOpen" : ""}`}>

      {/* LEFT SIDEBAR */}
      <div className="chatList">
        <h3>Messages</h3>

        {conversations.map((c) => {
          const otherUser = c.members?.find(
            (m) => String(m?._id || m) !== String(userId)
          );

          return (
            <div
              key={c._id}
              onClick={() => setCurrentChat(c)}
              className={`chatItem ${
                currentChat?._id === c._id ? "active" : ""
              }`}
            >
              <img
                src={
                  otherUser?.profileImage
                    ? `http://localhost:3000/uploads/${otherUser.profileImage}`
                    : "https://i.pravatar.cc/40"
                }
                alt=""
                className="avatar"
              />

              <div className="chatInfo">
                <span className="username">
                  {otherUser?.username || "User"}
                </span>
                <span className="lastMsg">Tap to chat</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT CHAT */}
      <div className="chatBox">

        {currentChat ? (
          <>
            {/* HEADER */}
            <div className="chatHeader">

              <button
                className="backBtn"
                onClick={() => setCurrentChat(null)}
              >
                ←
              </button>

              <img
                src={
                  chatUser?.profileImage
                    ? `http://localhost:3000/uploads/${chatUser.profileImage}`
                    : "https://i.pravatar.cc/40"
                }
                alt=""
              />
              <span>{chatUser?.username || "User"}</span>

              {/* 🗑 DELETE CHAT */}
              <button className="deleteChatBtn" onClick={deleteChat}>
                🗑
              </button>
            </div>

            {/* MESSAGES */}
           <div className="messages">
  {messages.map((m) => (
    <div
      ref={scrollRef}
      key={m._id}
      onMouseDown={() => handlePressStart(m._id)}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={() => handlePressStart(m._id)}
      onTouchEnd={handlePressEnd}
      className={
        String(m.senderId) === String(userId)
          ? "message own"
          : "message"
      }
    >
      <p>{m.text}</p>

      {/* 🔥 SHOW ONLY ON LONG PRESS */}
      {activeMsg === m._id &&
        String(m.senderId) === String(userId) && (
          <div className="msgActions">
            <span onClick={() => deleteMessage(m._id, "me")}>❌</span>
            <span onClick={() => deleteMessage(m._id, "everyone")}>🗑</span>
          </div>
        )}

      <span className="time">
        {new Date(
          m.createdAt || Date.now()
        ).toLocaleTimeString()}
      </span>
    </div>
  ))}

  {typing && <div className="typing">Typing...</div>}
</div>

            {/* INPUT */}
            <div className="inputBox">
              <input
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);

                  socket.emit("typing", {
                    receiverId: chatUser?._id,
                  });
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
                placeholder="Type a message..."
              />

              <button onClick={sendMessage}>➤</button>
            </div>
          </>
        ) : (
          <div className="noChat">
            Start a conversation 
          </div>
        )}

      </div>
    </div>
  );
};

export default Message;