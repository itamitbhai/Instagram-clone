import React, { useState, useEffect } from 'react'
import "../style/post.scss"
import DeletePost from "../pages/DeletePost"
import Comments from "../components/Comment"
import { useNavigate } from "react-router-dom"

const Post = ({ user, post, handleLike, handleUnLike, handleDeletePost }) => {

    const [showDelete, setShowDelete]     = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [animate, setAnimate]           = useState(false)
    const [isLiked, setIsLiked]           = useState(post?.isLiked ?? false)

    useEffect(() => {
        console.log("useEffect chala — isLiked:", post?.isLiked)
        setIsLiked(post?.isLiked ?? false)
    }, [post?.isLiked])

    const navigate = useNavigate()

    function handlePostClick() {
        setShowDelete(prev => !prev)
    }

    function handleLikeClick(e) {
        e.stopPropagation()
        setAnimate(true)
        setTimeout(() => setAnimate(false), 300)

        //post.isLiked NAHI — isLiked local state use karo
        if (isLiked) {
            setIsLiked(false)
            handleUnLike(post._id)
        } else {
            setIsLiked(true)
            handleLike(post._id)
        }
    }

    if (!post) return null

    return (
        <div className="post" onClick={handlePostClick}>

            {showDelete && (
                <div className="deletePopup" onClick={(e) => e.stopPropagation()}>
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
                        navigate(`/profile/${user?.username}`)
                    }}
                >
                    <img src={user?.profileImage || "/default.png"} alt="" />
                </div>

                <p
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/profile/${user?.username}`)
                    }}
                    style={{ cursor: "pointer" }}
                >
                    {user?.username || "Unknown User"}
                </p>
            </div>

            {/* POST IMAGE */}
            <img src={post.imgUrl} alt="post" className="postImg" />

            {/* ICONS */}
            <div className="icons">
                <div className="left">

                    <button
                        type="button"
                        className={`Like ${animate ? "bounce" : ""}`}
                        onClick={handleLikeClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            style={{
                                fill: isLiked ? "red" : "white",  // ✅ isLiked local state
                                transition: "fill 0.2s ease",
                                width: "24px",
                                height: "24px",
                            }}
                        >
                            <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />
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
                            <path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455Z" />
                        </svg>
                    </button>

                </div>
            </div>

            {/* LIKE COUNT */}
            {post.likes?.length > 0 && (
                <div className="likeCount" onClick={(e) => e.stopPropagation()}>
                    {post.likes.length.toLocaleString()} {post.likes.length === 1 ? "like" : "likes"}
                </div>
            )}

            {/* CAPTION */}
            <div className="bottom" onClick={(e) => e.stopPropagation()}>
                <p className="caption">
                    <span
                        className="captionUsername"
                        onClick={() => navigate(`/profile/${user?.username}`)}
                    >
                        {user?.username}
                    </span>
                    {" "}{post.caption}
                </p>
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