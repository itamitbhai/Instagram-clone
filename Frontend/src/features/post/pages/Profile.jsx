import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "../style/profile.scss"
import Message from "../../post/pages/Message"

import { getUserProfile } from "../services/post.api"
import { followUser, unfollowUser, updateProfile } from "../../auth/services/auth.api"
import { useAuth } from "../../auth/hooks/useAuth"

const Profile = () => {

    const { username } = useParams()
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    const [selectedPost, setSelectedPost] = useState(null)
    const [showFollowers, setShowFollowers] = useState(false)
    const [showFollowing, setShowFollowing] = useState(false)

    // 🔥 EDIT STATE
    const [showEdit, setShowEdit] = useState(false)
    const [bio, setBio] = useState("")
    const [image, setImage] = useState("")

    // LOAD PROFILE
    useEffect(() => {
        loadProfile()
    }, [username])

    async function loadProfile() {
        try {
            setLoading(true)
            const res = await getUserProfile(username)
            setData(res)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    // FOLLOW / UNFOLLOW
    async function handleFollow() {
        try {
            if (data.user.isFollowing) {
                await unfollowUser(username)
            } else {
                await followUser(username)
            }
            await loadProfile()
        } catch (err) {
            console.log(err)
        }
    }

    

   async function handleMessage() {

    const senderId = currentUser?._id || currentUser?.id;
     const receiverId = currentUser?._id || currentUser?.id;
    console.log("DEBUG:", { senderId, receiverId, data });

    // 🔥 strong validation
    if (!senderId) {
        console.log("❌ senderId missing");
        return;
    }

    if (!receiverId) {
        console.log("❌ receiverId missing (data not loaded yet)");
        return;
    }

    try {
        const res = await axios.post(
            "http://localhost:3000/api/conversations",
            {
                senderId,
                receiverId,
            }
        );

        navigate("/messages", {
            state: { conversation: res.data }
        });

    } catch (err) {
        console.log("❌ Message Error:", err);
    }
}

    // 🔥 SAVE EDIT
    async function handleSave() {
        try {
            const formData = new FormData()

            formData.append("bio", bio)

            if (image) {
                formData.append("profileImage", image)
            }

            await updateProfile(formData)
            await loadProfile()
            setShowEdit(false)

        } catch (err) {
            console.log("SAVE ERROR:", err)
        }
    }

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>
    if (!data) return <h2>User not found</h2>

    return (
        <div className="profile">

            {/* HEADER */}
            <div className="profile-header">

                <img 
                    src={data.user.profileImage} 
                    alt="profile"
                    className="profile-pic"
                />

                <div className="info">

                    <div className="top">
                        <h2>{data.user.username}</h2>

                        {/*  BUTTONS */}
                        {currentUser && currentUser.username === data.user.username ? (
                            <button 
                                className="edit-btn"
                                onClick={() => {
                                    setShowEdit(true)
                                    setBio(data.user.bio || "")
                                    setImage(data.user.profileImage || "")
                                }}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button 
                                    className="follow-btn"
                                    onClick={handleFollow}
                                >
                                    {data.user.isFollowing ? "Following" : "Follow"}
                                </button>

                                <button 
                                    className="msg-btn"
                                    // disabled={!data?.user?._id}
                                    onClick={handleMessage}

                                >
                                    Message
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="stats">
                        <span><b>{data.postCount}</b> posts</span>

                        <span onClick={() => setShowFollowers(true)} style={{ cursor: "pointer" }}>
                            <b>{data.user.followers}</b> followers
                        </span>

                        <span onClick={() => setShowFollowing(true)} style={{ cursor: "pointer" }}>
                            <b>{data.user.following}</b> following
                        </span>
                    </div>

                    <p className="bio">
                        {data.user.bio || "No bio"}
                    </p>

                </div>
            </div>

            {/* POSTS */}
            <div className="posts-grid">
                {data.posts.length === 0 ? (
                    <p className="no-posts">No posts yet</p>
                ) : (
                    data.posts.map(post => (
                        <img 
                            key={post._id}
                            src={post.imgUrl}
                            alt="post"
                            className="post-img"
                            onClick={() => setSelectedPost(post)}
                        />
                    ))
                )}
            </div>

            {/* IMAGE MODAL */}
            {selectedPost && (
                <div className="modal" onClick={() => setSelectedPost(null)}>
                    <img 
                        src={selectedPost.imgUrl}
                        className="modal-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* EDIT MODAL */}
            {showEdit && (
                <div className="modal" onClick={() => setShowEdit(false)}>
                    <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
                        <h3>Edit Profile</h3>

                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                setImage(file)
                            }}
                        />

                        <textarea
                            value={bio}
                            onChange={(e)=>setBio(e.target.value)}
                            placeholder="Write your bio..."
                        />

                        <button onClick={handleSave}>
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Followers modal */}
            {showFollowers && (
                <div className="modal" onClick={() => setShowFollowers(false)}>
                    <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
                        <h3>Followers</h3>

                        {!data?.followersList || data.followersList.length === 0 ? (
                            <p className="empty">No followers</p>
                        ) : (
                            data.followersList.map(user => (
                                <div 
                                    key={user._id} 
                                    className="user-row"
                                    onClick={() => window.location.href = `/profile/${user.username}`}
                                >
                                    <img src={user.profileImage} alt="" />
                                    <div>
                                        <span className="username">{user.username}</span>
                                        <span className="sub">View profile</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Following modal */}
            {showFollowing && (
                <div className="modal" onClick={() => setShowFollowing(false)}>
                    <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
                        <h3>Following</h3>

                        {!data?.followingList || data.followingList.length === 0 ? (
                            <p className="empty">No following</p>
                        ) : (
                            data.followingList.map(user => (
                                <div 
                                    key={user._id} 
                                    className="user-row"
                                    onClick={() => window.location.href = `/profile/${user.username}`}
                                >
                                    <img src={user.profileImage} alt="" />
                                    <div>
                                        <span className="username">{user.username}</span>
                                        <span className="sub">View profile</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Profile