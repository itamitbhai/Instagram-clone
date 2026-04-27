import { useState, useEffect } from "react"
import { usePost } from "../hook/usePost.js"
import "../style/comment.scss"

const Comment = ({ postId }) => {

    const { handleAddComment, handleGetComments, handleDeleteComment } = usePost()

    const [comments, setComments] = useState([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [openMenuId, setOpenMenuId] = useState(null)

    useEffect(() => {
        if (!postId) return

        const load = async () => {
            const data = await handleGetComments(postId)
            setComments(data || [])
        }

        load()
    }, [postId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!text.trim()) return

        setLoading(true)
        const newComment = await handleAddComment(postId, text)

        if (newComment) {
            setComments(prev => [newComment, ...prev])
        }

        setText("")
        setLoading(false)
    }

    const handleDelete = async (id) => {
        const success = await handleDeleteComment(id)

        if (success) {
            setComments(prev => prev.filter(c => c._id !== id))
        }

        setOpenMenuId(null)
    }

    return (
        <div className="comment-section" onClick={() => setOpenMenuId(null)}>

            <div className="comments">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments</p>
                ) : (
                    comments.map((c) => (
                        <div key={c._id} className="comment">

                            <span className="username">{c.user}</span>
                            <span className="text">{c.text}</span>

                            {c.isOwner && (
                                <div className="menu-wrapper" onClick={(e) => e.stopPropagation()}>

                                    <button 
                                        className="menu-btn"
                                        onClick={() => setOpenMenuId(openMenuId === c._id ? null : c._id)}
                                    >
                                        ⋯
                                    </button>

                                    {openMenuId === c._id && (
                                        <div className="menu">
                                            <button 
                                                className="delete-option"
                                                onClick={() => handleDelete(c._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}

                                </div>
                            )}

                        </div>
                    ))
                )}
            </div>

            <form className="comment-input" onSubmit={handleSubmit}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add comment..."
                />
                <button disabled={loading}>
                    {loading ? "..." : "Post"}
                </button>
            </form>

        </div>
    )
}

export default Comment