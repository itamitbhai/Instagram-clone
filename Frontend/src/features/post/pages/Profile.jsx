import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/profile.scss";

import { getUserProfile } from "../services/post.api";
import { followUser, unfollowUser, updateProfile } from "../../auth/services/auth.api";
import { useAuth } from "../../auth/hooks/useAuth";

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedPost, setSelectedPost] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [bio, setBio] = useState("");
    const [image, setImage] = useState("");

    //  LOAD PROFILE
    useEffect(() => {
        loadProfile();
    }, [username]);

    async function loadProfile() {
        try {
            setLoading(true);
            const res = await getUserProfile(username);
            setData(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    //  DEBUG (IMPORTANT)
    useEffect(() => {
        if (data) {
            console.log("USERNAME:", username);
            console.log("CURRENT USER:", currentUser?._id);
            console.log("PROFILE USER:", data?.user?._id);
            console.log("FULL DATA:", data);
        }
    }, [data]);

    // FOLLOW / UNFOLLOW
    async function handleFollow() {
        try {
            if (data.user.isFollowing) {
                await unfollowUser(username);
            } else {
                await followUser(username);
            }
            await loadProfile();
        } catch (err) {
            console.log(err);
        }
    }

    //  MESSAGE (FINAL FIX)
    async function handleMessage() {
        const senderId = currentUser?._id;
        const receiverId = data?.user?._id;

        if (!senderId || !receiverId) {
            console.log(" Missing IDs");
            return;
        }

        // prevent self chat
        if (String(senderId) === String(receiverId)) {
            console.log(" Cannot message yourself");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:3000/api/conversations",
                { senderId, receiverId }
            );

            navigate("/messages", {
                state: { conversation: res.data }
            });

        } catch (err) {
            console.log("Message Error:", err);
        }
    }

    // SAVE PROFILE
    async function handleSave() {
        try {
            const formData = new FormData();
            formData.append("bio", bio);

            if (image) {
                formData.append("profileImage", image);
            }

            await updateProfile(formData);
            await loadProfile();
            setShowEdit(false);

        } catch (err) {
            console.log("SAVE ERROR:", err);
        }
    }

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    if (!data) return <h2>User not found</h2>;

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

                        {currentUser && currentUser.username === data.user.username ? (
                            <button 
                                className="edit-btn"
                                onClick={() => {
                                    setShowEdit(true);
                                    setBio(data.user.bio || "");
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
                                    disabled={!data?.user?._id}
                                    onClick={handleMessage}
                                >
                                    Message
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="stats">
                        <span><b>{data.postCount}</b> posts</span>

                        <span onClick={() => setShowFollowers(true)}>
                            <b>{data.user.followers}</b> followers
                        </span>

                        <span onClick={() => setShowFollowing(true)}>
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
                {data.posts.map(post => (
                    <img 
                        key={post._id}
                        src={post.imgUrl}
                        alt="post"
                        className="post-img"
                        onClick={() => setSelectedPost(post)}
                    />
                ))}
            </div>

            {/* FOLLOWERS */}
            {showFollowers && (
                <div className="modal" onClick={() => setShowFollowers(false)}>
                    <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
                        <h3>Followers</h3>

                        {data.followersList.map(user => (
                            <div 
                                key={user._id}
                                className="user-row"
                                onClick={() => navigate(`/profile/${user.username}`)}
                            >
                                <img src={user.profileImage} alt="" />
                                <span>{user.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FOLLOWING */}
            {showFollowing && (
                <div className="modal" onClick={() => setShowFollowing(false)}>
                    <div className="modal-box" onClick={(e)=>e.stopPropagation()}>
                        <h3>Following</h3>

                        {data.followingList.map(user => (
                            <div 
                                key={user._id}
                                className="user-row"
                                onClick={() => navigate(`/profile/${user.username}`)}
                            >
                                <img src={user.profileImage} alt="" />
                                <span>{user.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* EDIT PROFILE MODAL */}
           {showEdit && (
  <div className="modal" onClick={() => setShowEdit(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>

      <h2>Edit Profile</h2>

      {/* PROFILE IMAGE */}
      <label className="file-upload">
        <span>Change Profile Photo</span>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>

      {/* BIO */}
      <textarea
        className="bio-input"
        placeholder="Write something about yourself..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      {/* BUTTONS */}
      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => setShowEdit(false)}>
          Cancel
        </button>

        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </div>

    </div>
  </div>
)}
            {selectedPost && (
             <div 
               className="modal" 
               onClick={() => setSelectedPost(null)}
             >
               <div 
                 className="imageModal" 
                 onClick={(e) => e.stopPropagation()}
               >
                 <img src={selectedPost.imgUrl} alt="preview" />

                 {/*  CLOSE BUTTON */}
                 <button 
                   className="closeBtn"
                   onClick={() => setSelectedPost(null)}
                 >
                   ✕
                 </button>
               </div>
             </div>
           )}

        </div>
    );
};

export default Profile;