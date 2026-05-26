import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { API_BASE_URL } from "../../../config"

const SOCKET_URL = API_BASE_URL

export const useNotification = (userId) => {

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!userId) return

    // existing socket reuse karo
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, { withCredentials: true })
      socketRef.current.emit("addUser", userId)
    }

    // ✅ real-time notification receive karo
    socketRef.current.on("getNotification", (data) => {
      setNotifications(prev => [data, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    return () => {
      socketRef.current?.off("getNotification")
    }
  }, [userId])

  // ✅ sab read mark karo
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  // ✅ ek notification delete karo
  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return { notifications, unreadCount, markAllRead, removeNotification }
}