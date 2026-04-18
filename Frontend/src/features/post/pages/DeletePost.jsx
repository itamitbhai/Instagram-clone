import React from "react"

const DeletePost = ({ postId, handleDeletePost }) => {

    function onDelete(e) {
        e.stopPropagation()

        const confirmDelete = window.confirm("Are you sure you want to delete this post?")
        if (!confirmDelete) return

        handleDeletePost(postId)
    }

    return (
        <button className="delete-btn" onClick={onDelete}>
            Delete
        </button>
    )
}

export default DeletePost