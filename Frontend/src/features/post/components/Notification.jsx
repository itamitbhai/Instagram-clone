import { useState, useRef, useEffect } from "react"
import { useNotification } from "../hook/useNotification"
import { getUserAvatar } from "../../../config"
import "../style/notification.scss"

const getNotificationText = (n) => {
  switch (n.type) {
    case "like":    return `${n.senderUsername} ne aapki post like ki ❤️`
    case "comment": return `${n.senderUsername} ne comment kiya 💬`
    case "follow":  return `${n.senderUsername} ne follow kiya 👤`
    case "message": return `${n.senderUsername} ne message kiya 📩`
    default:        return `${n.senderUsername} ne kuch kiya`
  }
}

const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / 1000)
  if (diff < 60)   return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

const Notification = ({ userId }) => {

  const { notifications, unreadCount, markAllRead, removeNotification } = useNotification(userId)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // ✅ bahar click karne par band ho
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleOpen = () => {
    setOpen(prev => !prev)
    if (!open) markAllRead()
  }

  return (
    <div className="notification-wrapper" ref={dropdownRef}>

      {/* ✅ BELL ICON */}
      <button className="bell-btn" onClick={handleOpen}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>

        {/* ✅ UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {/* ✅ DROPDOWN */}
      {open && (
        <div className="notification-dropdown">

          <div className="notif-header">
            <h4>Notifications</h4>
            {notifications.length > 0 && (
              <button onClick={() => { /* clear all */ }}>Clear all</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="empty">Koi notification nahi</p>
          ) : (
            <ul>
              {notifications.map((n, i) => (
                <li key={i} className={`notif-item ${n.isRead ? "read" : "unread"}`}>
                  <img 
                    src={getUserAvatar(n.senderProfileImage || { username: n.senderUsername })} 
                    alt={n.senderUsername} 
                    className="notif-avatar" 
                  />
                  <div className="notif-info">
                    <span className="notif-text">{getNotificationText(n)}</span>
                    <span className="notif-time">{timeAgo(n.createdAt)}</span>
                  </div>
                  <button className="notif-close" onClick={() => removeNotification(i)}>✕</button>
                </li>
              ))}
            </ul>
          )}

        </div>
      )}

    </div>
  )
}

export default Notification