import { 
    getFeed, 
    createPost, 
    likePost, 
    unLikePost, 
    deletePost,
    addComment,
    getComments
} from "../services/post.api"

import { useContext, useEffect } from "react"
import { PostContext } from "../post.context"

export const usePost = () => {

    const context = useContext(PostContext)

    const { loading, setLoading, post, setPost, feed, setFeed } = context

    //  FEED
    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts.reverse())
        setLoading(false)
    }

    //  CREATE POST
    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([data.post, ...feed])
        setLoading(false)
    }

    //  LIKE
    const handleLike = async (postId) => {
        await likePost(postId)
        await handleGetFeed()
    }

    //  UNLIKE
    const handleUnLike = async (postId) => {
        await unLikePost(postId)
        await handleGetFeed()
    }

    //  DELETE
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

    // 💬 ADD COMMENT
    const handleAddComment = async (postId, text) => {
        try {
            const res = await addComment(postId, text)
            return res.comment   // 👈 component ko return karo
        } catch (error) {
            console.log(error)
        }
    }

    // 📥 GET COMMENTS
    const handleGetComments = async (postId) => {
        try {
            const comments = await getComments(postId)
            return comments
        } catch (error) {
            console.log(error)
            return []
        }
    }

    useEffect(() => {
        handleGetFeed()
    }, [])

    return { 
        loading, 
        feed, 
        post, 
        handleGetFeed, 
        handleCreatePost, 
        handleLike, 
        handleUnLike,
        handleDeletePost,
        handleAddComment,     
        handleGetComments     
    }  
}