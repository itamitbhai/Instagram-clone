import React, { useEffect, useRef } from "react";
import { X, Heart, MessageCircle, UserPlus, HelpCircle } from "lucide-react";
import gsap from "gsap";
import { useNotification } from "../hook/useNotification";
import "../style/notificationpanel.scss";

const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return <Heart size={16} style={{ fill: "#ff3040", stroke: "#ff3040" }} />;
    case "comment":
      return <MessageCircle size={16} style={{ fill: "#0095f6", stroke: "#0095f6" }} />;
    case "follow":
      return <UserPlus size={16} style={{ color: "#00f695" }} />;
    default:
      return <HelpCircle size={16} style={{ color: "#a8a8a8" }} />;
  }
};

const getNotificationText = (n) => {
  switch (n.type) {
    case "like":
      return "liked your post.";
    case "comment":
      return "commented on your post.";
    case "follow":
      return "started following you.";
    case "message":
      return "sent you a message.";
    default:
      return "performed an action.";
  }
};

const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationPanel = ({ isOpen, onClose, userId }) => {
  const { notifications, unreadCount, markAllRead, removeNotification } = useNotification(userId);
  const panelRef = useRef(null);

  // GSAP animation for sliding panel
  useEffect(() => {
    if (isOpen) {
      markAllRead(); // Mark all read when user opens the panel
      gsap.to(panelRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(panelRef.current, {
        x: "-100%",
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop for mobile overlays */}
      {isOpen && (
        <div className="notification-panel-backdrop" onClick={onClose} />
      )}

      <div
        ref={panelRef}
        className="notification-panel"
        style={{ transform: "translateX(-100%)", opacity: 0 }}
      >
        <div className="notification-panel-header">
          <h2>Notifications</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="notification-list-container">
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <div className="heart-circle">
                <Heart size={32} style={{ fill: "none", stroke: "#a8a8a8", strokeWidth: "1.5" }} />
              </div>
              <h3>Activity On Your Posts</h3>
              <p>When someone likes or comments on your posts, you'll see it here.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className={`notification-item-card ${n.isRead ? "read" : "unread"}`}
                >
                  <div className="notif-avatar-wrapper">
                    <div className="notif-icon-badge">
                      {getNotificationIcon(n.type)}
                    </div>
                  </div>

                  <div className="notification-content">
                    <p className="notif-text">
                      <span className="notif-username">{n.senderUsername}</span>
                      {" "}
                      <span className="notif-desc">{getNotificationText(n)}</span>
                    </p>
                    <span className="notif-time">{timeAgo(n.createdAt)}</span>
                  </div>

                  <button
                    className="notif-item-close"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(i);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
