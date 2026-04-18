// import { getFeed, createPost, likePost, unLikePost } from "../services/post.api"
// import { useContext, useEffect } from "react"
// import { PostContext } from "../post.context"

// export const usePost = () => {

//     const context = useContext(PostContext)

//     const { loading, setLoading, post, setPost, feed, setFeed } = context

//     const handleGetFeed = async () => {
//         setLoading(true)
//         const data = await getFeed()
//         setFeed(data.posts.reverse())
//         setLoading(false)
//     }

//     const handleCreatePost = async (imageFile, caption) => {
//         setLoading(true)
//         const data = await createPost(imageFile, caption)
//         setFeed([ data.post, ...feed ])
//         setLoading(false)
//     }
//     const handleLike = async (postId) => {
//     await likePost(postId)
//     await handleGetFeed()
// }

// const handleUnLike = async (postId) => {
//     await unLikePost(postId)
//     await handleGetFeed()
// }

//     useEffect(() => {
//         handleGetFeed()
//     }, [])

//     return { loading, feed, post, handleGetFeed, handleCreatePost, handleLike, handleUnLike }

// }

import { getFeed, createPost, likePost, unLikePost, deletePost } from "../services/post.api"
import { useContext, useEffect } from "react"
import { PostContext } from "../post.context"

export const usePost = () => {

    const context = useContext(PostContext)

    const { loading, setLoading, post, setPost, feed, setFeed } = context

    const handleGetFeed = async () => {
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts.reverse())
        setLoading(false)
    }

    const handleCreatePost = async (imageFile, caption) => {
        setLoading(true)
        const data = await createPost(imageFile, caption)
        setFeed([data.post, ...feed])
        setLoading(false)
    }

    const handleLike = async (postId) => {
        await likePost(postId)
        await handleGetFeed()
    }

    const handleUnLike = async (postId) => {
        await unLikePost(postId)
        await handleGetFeed()
    }

    // 🔥 DELETE FUNCTION
    const handleDeletePost = async (postId) => {
        try {
            setLoading(true)

            await deletePost(postId)

            setFeed(prev => prev.filter(post => post._id !== postId))

            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
        console.log("delete handle");
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
        handleDeletePost
    }
}