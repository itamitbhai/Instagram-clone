import React, { useState } from 'react'
import "../style/post.scss"
import DeletePost from "../pages/DeletePost"
import Comments from "../components/Comment"
import { useNavigate } from "react-router-dom"   // ✅ ADD

const Post = ({ user, post, handleLike, handleUnLike, handleDeletePost }) => {

    const [showDelete, setShowDelete] = useState(false)
    const [showComments, setShowComments] = useState(false)

    const navigate = useNavigate()  

    function handlePostClick() {
        setShowDelete(prev => !prev)
    }

    if (!post) return null

    return (
        <div className="post" onClick={handlePostClick}>

            {showDelete && (
                <div onClick={(e) => e.stopPropagation()}>
                    <DeletePost 
                        postId={post._id} 
                        handleDeletePost={handleDeletePost}
                    />
                </div>
            )}

            {/* USER INFO */}
            <div className="user">
                <div 
                    className="img-wrapper"
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${user?.username}`)   // ✅ NAVIGATE
                    }}
                >
                    <img 
                        src={user?.profileImage || "/default.png"} 
                        alt="" 
                    />
                </div>

                <p 
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${user?.username}`)   // ✅ NAVIGATE
                    }}
                    style={{ cursor: "pointer" }}
                >
                    {user?.username || "Unknown User"}
                </p>
            </div>

            {/* POST IMAGE */}
            <img src={post.imgUrl} alt="post" />

            {/* ICONS */}
            <div className="icons">
                <div className="left">

                    {/* LIKE */}
                    <button 
                        type="button"
                        className='Like'
                        onClick={(e) => {
                            e.stopPropagation()
                            post.isLiked 
                                ? handleUnLike(post._id) 
                                : handleLike(post._id)
                        }}
                    >
                        <svg
                            className={post.isLiked ? "like" : ""}
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                        >
                            <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path>
                        </svg>
                    </button>

                    {/* COMMENT */}
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowComments(prev => !prev)
                        }}
                    >
                        <svg
                            className={showComments ? "active" : ""}
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                        >
                            <path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z"></path>
                        </svg>
                    </button>

                </div>
            </div>

            {/* CAPTION */}
            <div className="bottom">
                <p className="caption">{post.caption}</p>
            </div>

            {/* COMMENTS */}
            {showComments && (
                <div onClick={(e) => e.stopPropagation()}>
                    <Comments postId={post._id} />
                </div>
            )}

        </div>
    )
}

export default Post