import { Edit } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../../socket";
import { useAuth } from "../../auth/hooks/useAuth";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../../config";
import "../style/message.scss";

const getProfileImage = (profileImage) => {
  if (!profileImage) return "https://i.pravatar.cc/40";
  if (profileImage.startsWith("http://") || profileImage.startsWith("https://")) {
    if (profileImage.includes("localhost:3000")) {
      return profileImage.replace("http://localhost:3000", API_BASE_URL);
    }
    return profileImage;
  }
  return `${API_BASE_URL}/uploads/${profileImage}`;
};

const Message = () => {
  const { user } = useAuth();
  const userId = user?._id;

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
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const scrollRef = useRef();

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

  useEffect(() => {
    if (!userId) return;
    socket.emit("addUser", userId);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API_BASE_URL}/api/conversations/${userId}`)
      .then((res) => setConversations(res.data || []))
      .catch((err) => console.log("Conversation Error:", err));
  }, [userId]);

  useEffect(() => {
    if (!currentChat?._id) return;
    axios
      .get(`${API_BASE_URL}/api/messages/${currentChat._id}`)
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.log("Message Fetch Error:", err));
  }, [currentChat]);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("getMessage");
  }, []);

  useEffect(() => {
    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    });
    return () => socket.off("typing");
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const res = await axios.post(`${API_BASE_URL}/api/messages`, payload);
      socket.emit("sendMessage", { ...payload, receiverId });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("❌ Send Error:", err.response?.data || err.message);
    }
  };

  const deleteMessage = async (msgId, type = "me") => {
    try {
      if (type === "everyone") {
        await axios.delete(`${API_BASE_URL}/api/messages/${msgId}`, {
          withCredentials: true,
        });
        socket.emit("deleteMessage", { messageId: msgId });
      } else {
        await axios.put(
          `${API_BASE_URL}/api/messages/delete-for-me/${msgId}`,
          { userId },
          { withCredentials: true }
        );
      }
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
    } catch (err) {
      console.log("Delete Msg Error:", err.response?.data || err.message);
    }
  };

  const deleteChat = async () => {
    if (!currentChat) return;
    if (!window.confirm("Delete entire chat?")) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/conversations/${currentChat._id}`,
        { withCredentials: true }
      );
      setConversations((prev) => prev.filter((c) => c._id !== currentChat._id));
      setCurrentChat(null);
      setMessages([]);
    } catch (err) {
      console.log("Delete Chat Error:", err);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) return setSearchResults([]);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/search?q=${query}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSearchResults(res.data.users || []);
    } catch (err) {
      console.log("Search error:", err);
    }
  };

  const startConversation = async (otherUserId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/conversations`,
        { senderId: userId, receiverId: otherUserId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCurrentChat(res.data);
      setConversations((prev) => {
        const exists = prev.find((c) => c._id === res.data._id);
        return exists ? prev : [res.data, ...prev];
      });
      setShowNewChat(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (err) {
      console.log("Start conv error:", err);
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

        {/* ✅ HEADER WITH NEW CHAT BUTTON */}
        <div className="chatListHeader">
          <h3>Messages</h3>
          <button className="newChatBtn" onClick={() => setShowNewChat((prev) => !prev)}>
            <Edit size={20} />
          </button>
        </div>

        {/* ✅ SEARCH MODAL */}
        {showNewChat && (
          <div className="newChatModal">
            <input
              autoFocus
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);
              }}
            />
            <div className="searchResults">
              {searchResults.length === 0 && searchQuery.trim() && (
                <p className="noResults">No users found</p>
              )}
              {searchResults.map((u) => (
                <div
                  key={u._id}
                  className="searchItem"
                  onClick={() => startConversation(u._id)}
                >
                  <img
                    src={u.profileImage || "https://i.pravatar.cc/40"}
                    alt=""
                    className="avatar"
                  />
                  <span>{u.username}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONVERSATIONS LIST */}
        {conversations.map((c) => {
          const otherUser = c.members?.find(
            (m) => String(m?._id || m) !== String(userId)
          );

          return (
            <div
              key={c._id}
              onClick={() => setCurrentChat(c)}
              className={`chatItem ${currentChat?._id === c._id ? "active" : ""}`}
            >
              <img
                src={getProfileImage(otherUser?.profileImage)}
                alt=""
                className="avatar"
              />
              <div className="chatInfo">
                <span className="username">{otherUser?.username || "User"}</span>
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
              <button className="backBtn" onClick={() => setCurrentChat(null)}>
                ←
              </button>
              <img
                src={getProfileImage(chatUser?.profileImage)}
                alt=""
              />
              <span>{chatUser?.username || "User"}</span>
              <button className="deleteChatBtn" onClick={deleteChat}>🗑</button>
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
                    String(m.senderId) === String(userId) ? "message own" : "message"
                  }
                >
                  <p>{m.text}</p>

                  {activeMsg === m._id && String(m.senderId) === String(userId) && (
                    <div className="msgActions">
                      <span onClick={() => deleteMessage(m._id, "me")}>❌</span>
                      <span onClick={() => deleteMessage(m._id, "everyone")}>🗑</span>
                    </div>
                  )}

                  <span className="time">
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString()}
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
                  socket.emit("typing", { receiverId: chatUser?._id });
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>➤</button>
            </div>
          </>
        ) : (
          <div className="noChat">Start a conversation</div>
        )}
      </div>
    </div>
  );
};

export default Message;