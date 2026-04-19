import { useState, useEffect } from "react"
import { usePost } from "../hook/usePost.js"
import "../style/comment.scss"

const Comment = ({ postId }) => {

    const { handleAddComment, handleGetComments } = usePost()

    const [comments, setComments] = useState([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)

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

        try {
            setLoading(true)

            const newComment = await handleAddComment(postId, text)

            if (newComment) {
                setComments(prev => [newComment, ...prev])
            }

            setText("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="comment-section" onClick={(e) => e.stopPropagation()}>

            <div className="comments">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments</p>
                ) : (
                    comments.map((c, i) => (
                        <div key={i} className="comment">
                            <span className="username">{c.user}</span>
                            <span className="text">{c.text}</span>
                        </div>
                    ))
                )}
            </div>

            <form className="comment-input" onSubmit={handleSubmit}>
                <input
                    disabled={loading}
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