import { 
    getFeed, createPost, likePost, unLikePost, 
    deletePost, addComment, getComments, deleteComment
} from "../services/post.api"

import { useContext, useRef } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { PostContext } from "../post.context"
import { io } from "socket.io-client"
import { API_BASE_URL } from "../../../config"

const SOCKET_URL = API_BASE_URL
let socketInstance = null

export const usePost = () => {
    const { user: currentUser } = useAuth()

    const context = useContext(PostContext)
    const { loading, setLoading, post, setPost, feed, setFeed } = context

    // socket reuse
    const getSocket = () => {
        if (!socketInstance) {
            socketInstance = io(SOCKET_URL, { withCredentials: true })
            if (currentUser?._id) {
                socketInstance.emit("addUser", currentUser._id)
            }
        }
        return socketInstance
    }

    // ✅ notification helper
    const notify = (receiverId, type, postId = null) => {
        if (!receiverId || receiverId === currentUser?._id) return // khud ko notify mat karo
        getSocket().emit("sendNotification", {
            receiverId,
            senderId:       currentUser?._id,
            senderUsername: currentUser?.username,
            senderProfileImage: currentUser?.profileImage || null,
            type,
            postId,
        })
    }

    // FEED
    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed([...data.posts].reverse())
        setLoading(false)
    }

    // CREATE POST
    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([data.post, ...feed])
        setLoading(false)
    }

    // ✅ LIKE — notification bhejo post owner ko
    const handleLike = async (postId) => {
        try {
            await likePost(postId)
            setFeed(prev => prev.map(p => {
                if (p._id === postId) {
                    // ✅ notification — post owner ko
                    notify(p.user?._id, "like", postId)
                    // Add local user to likes array if not already present
                    const hasLiked = p.likes?.some(l => l.user === currentUser?.username)
                    const updatedLikes = hasLiked ? (p.likes || []) : [...(p.likes || []), { user: currentUser?.username }]
                    return { ...p, isLiked: true, likes: updatedLikes }
                }
                return p
            }))
        } catch (error) {
            console.log("LIKE ERROR:", error)
        }
    }

    // ✅ UNLIKE
    const handleUnLike = async (postId) => {
        try {
            await unLikePost(postId)
            setFeed(prev => prev.map(p =>
                p._id === postId ? { 
                    ...p, 
                    isLiked: false, 
                    likes: (p.likes || []).filter(l => l.user !== currentUser?.username) 
                } : p
            ))
        } catch (error) {
            console.log("UNLIKE ERROR:", error)
        }
    }

    // DELETE
    const handleDeletePost = async (postId) => {
        try {
            setLoading(true)
            await deletePost(postId)
            setFeed(prev => prev.filter(post => post._id !== postId))
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // ✅ ADD COMMENT — notification bhejo
    const handleAddComment = async (postId, text) => {
        try {
            const res = await addComment(postId, text)
            // post owner ko notify karo
            const targetPost = feed.find(p => p._id === postId)
            notify(targetPost?.user?._id, "comment", postId)
            return res.comment
        } catch (error) {
            console.log(error)
        }
    }

    // GET COMMENTS
    const handleGetComments = async (postId) => {
        try {
            const comments = await getComments(postId)
            return comments
        } catch (error) {
            console.log(error)
            return []
        }
    }

    // DELETE COMMENT
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    return { 
        loading, feed, post,
        handleGetFeed, handleCreatePost,
        handleLike, handleUnLike, handleDeletePost,
        handleAddComment, handleGetComments, handleDeleteComment
    }
}