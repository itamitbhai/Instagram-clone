import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Heart, MessageCircle, Trash, Plus, X, Volume2, VolumeX, Music, Send, Play, Pause
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getUserAvatar } from "../../../config";
import "../style/reels.scss";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API}${path}`;
};

export default function Reels() {
  const { user: currentUser } = useAuth();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReelId, setActiveReelId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const containerRef = useRef(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/api/reels`, getAuthConfig());
      setReels(data);
      if (data.length > 0) {
        setActiveReelId(data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Intersection Observer to detect which Reel is in view
  useEffect(() => {
    if (loading || reels.length === 0) return;

    const observerOptions = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.6, // Reel is considered active when 60% is visible
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          setActiveReelId(id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const elements = containerRef.current?.querySelectorAll(".reel-card");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, [loading, reels]);

  const handleLikeToggle = async (reelId) => {
    try {
      const { data } = await axios.post(`${API}/api/reels/${reelId}/like`, {}, getAuthConfig());
      setReels((prev) =>
        prev.map((r) =>
          r._id === reelId
            ? { ...r, isLiked: data.isLiked, likesCount: data.likesCount }
            : r
        )
      );
    } catch (err) {
      console.error("Error liking reel:", err);
    }
  };

  const handleCommentAdded = (reelId, updatedComments) => {
    setReels((prev) =>
      prev.map((r) => (r._id === reelId ? { ...r, comments: updatedComments } : r))
    );
  };

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm("Are you sure you want to delete this Reel?")) return;
    try {
      await axios.delete(`${API}/api/reels/${reelId}`, getAuthConfig());
      setReels((prev) => prev.filter((r) => r._id !== reelId));
      if (activeReelId === reelId && reels.length > 1) {
        const remaining = reels.filter((r) => r._id !== reelId);
        setActiveReelId(remaining[0]._id);
      }
    } catch (err) {
      console.error("Error deleting reel:", err);
    }
  };

  return (
    <div className="reels-page-wrapper">
      <div className="reels-header">
        <h2>Reels</h2>
        <button className="create-reel-trigger-btn" onClick={() => setShowUpload(true)}>
          <Plus size={18} />
          <span>Create Reel</span>
        </button>
      </div>

      {loading ? (
        <div className="reels-loader">
          <div className="spinner"></div>
          <p>Reels loading...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="no-reels">
          <p>No Reels Available!</p>
          <button className="create-reel-trigger-btn" onClick={() => setShowUpload(true)}>
            Create a Reel
          </button>
        </div>
      ) : (
        <div className="reels-container" ref={containerRef}>
          {reels.map((reel) => (
            <ReelCard
              key={reel._id}
              reel={reel}
              isActive={reel._id === activeReelId}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              onLike={() => handleLikeToggle(reel._id)}
              onDelete={() => handleDeleteReel(reel._id)}
              onCommentAdded={(comments) => handleCommentAdded(reel._id, comments)}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}

      {showUpload && (
        <ReelUploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            fetchReels();
          }}
        />
      )}
    </div>
  );
}

// ReelCard Component for each Video Reel
function ReelCard({ reel, isActive, isMuted, onToggleMute, onLike, onDelete, onCommentAdded, currentUser }) {
  const videoRef = useRef(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // HUD states
  const [hudType, setHudType] = useState("mute"); // "mute" | "unmute" | "play" | "pause" | "like"
  const [showHUD, setShowHUD] = useState(false);

  // Autoplay / Active state synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay blocked, falling back to muted:", err);
            video.muted = true;
            video.play()
              .then(() => {
                setPlaying(true);
              })
              .catch((e) => console.error("Muted autoplay failed:", e));
          });
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setPlaying(false);
    }
  }, [isActive]);

  // Sync mute state changes dynamically
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    // Ensure it keeps playing on unmute if active
    if (isActive && !isMuted && video.paused) {
      video.play().catch((err) => console.log("Play failed on unmute:", err));
      setPlaying(true);
    }
  }, [isMuted, isActive]);

  const triggerHUD = (type) => {
    setHudType(type);
    setShowHUD(true);
  };

  useEffect(() => {
    if (showHUD) {
      const timer = setTimeout(() => {
        setShowHUD(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showHUD]);

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
      setPlaying(false);
      triggerHUD("pause");
    } else {
      video.play().catch((err) => console.log("Play failed:", err));
      setPlaying(true);
      triggerHUD("play");
    }
  };

  const lastTap = useRef(0);
  const handleVideoTouch = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap -> Like post
      if (!reel.isLiked) {
        onLike();
      }
      triggerHUD("like");
    } else {
      // Single tap -> Play/Pause
      handleVideoClick();
    }
    lastTap.current = now;
  };

  const handleMuteClick = (e) => {
    e.stopPropagation();
    onToggleMute();
    triggerHUD(isMuted ? "unmute" : "mute");
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const { data } = await axios.post(
        `${API}/api/reels/${reel._id}/comment`,
        { text: commentText },
        getAuthConfig()
      );
      onCommentAdded(data);
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isOwner = currentUser?._id && (reel.user?._id === currentUser._id || reel.user === currentUser._id);

  return (
    <div className="reel-card" data-id={reel._id}>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={imgUrl(reel.videoUrl)}
          loop
          muted={isMuted}
          playsInline
          onClick={handleVideoTouch}
        />

        {/* Center overlay HUD feedback */}
        {showHUD && (
          <div className="hud-overlay">
            <div className={`hud-icon-box ${hudType === "like" ? "hud-heart" : ""}`}>
              {hudType === "play" && <Play size={40} className="hud-icon" />}
              {hudType === "pause" && <Pause size={40} className="hud-icon" />}
              {hudType === "mute" && <VolumeX size={40} className="hud-icon" />}
              {hudType === "unmute" && <Volume2 size={40} className="hud-icon" />}
              {hudType === "like" && <Heart size={64} className="hud-icon liked" />}
            </div>
          </div>
        )}

        {/* Top-Right Quick Mute Button */}
        <button className="video-top-mute-btn" onClick={handleMuteClick} aria-label="Mute Toggle">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        {/* Video Overlay Info */}
        <div className="video-overlay" onClick={handleVideoTouch}>
          <div className="reel-user-details" onClick={(e) => e.stopPropagation()}>
            <div className="user-info-row">
              <img
                src={getUserAvatar(reel.user)}
                alt={reel.user?.username}
                className="reel-avatar"
              />
              <span className="reel-username">{reel.user?.username}</span>
              <button className="follow-btn">Follow</button>
            </div>
            
            {reel.caption && (
              <div className="caption-container">
                <p className={`reel-caption ${isExpanded ? "expanded" : ""}`}>
                  {reel.caption}
                </p>
                {reel.caption.length > 70 && (
                  <button className="more-btn" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "less" : "more"}
                  </button>
                )}
              </div>
            )}
            
            <div className="audio-info">
              <Music size={14} className="music-icon" />
              <div className="marquee-container">
                <span className="marquee-text">Original Audio • {reel.user?.username}</span>
              </div>
              {!isMuted && playing && (
                <div className="music-waves">
                  <span className="wave-bar"></span>
                  <span className="wave-bar"></span>
                  <span className="wave-bar"></span>
                </div>
              )}
            </div>
          </div>

          {/* Floating Actions on the right side */}
          <div className="reel-actions" onClick={(e) => e.stopPropagation()}>
            <div className="action-item" onClick={onLike}>
              <button className={`action-btn like-btn ${reel.isLiked ? "liked" : ""}`} aria-label="Like Button">
                <Heart size={26} fill={reel.isLiked ? "#ff3040" : "transparent"} stroke={reel.isLiked ? "#ff3040" : "#ffffff"} />
              </button>
              <span>{reel.likesCount || 0}</span>
            </div>

            <div className="action-item" onClick={() => setShowComments(!showComments)}>
              <button className="action-btn comment-btn" aria-label="Comment Button">
                <MessageCircle size={26} />
              </button>
              <span>{reel.comments?.length || 0}</span>
            </div>

            {isOwner && (
              <div className="action-item" onClick={onDelete}>
                <button className="action-btn delete-btn" aria-label="Delete Reel">
                  <Trash size={24} />
                </button>
                <span>Delete</span>
              </div>
            )}

            <div className="action-item" onClick={handleMuteClick}>
              <button className="action-btn mute-btn" aria-label="Mute Reel Toggle">
                {isMuted ? <VolumeX size={26} /> : <Volume2 size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Slid-up Comments Panel */}
        <div className={`comments-panel ${showComments ? "open" : ""}`}>
          <div className="comments-header">
            <h3>Comments</h3>
            <button className="close-comments" onClick={() => setShowComments(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="comments-list">
            {reel.comments && reel.comments.length > 0 ? (
              reel.comments.map((comment, index) => (
                <div key={comment._id || index} className="comment-item">
                  <img
                    src={getUserAvatar(comment.user)}
                    alt={comment.user?.username || "user"}
                    className="comment-avatar"
                  />
                  <div className="comment-body">
                    <span className="comment-username">{comment.user?.username || "user"}</span>
                    <p className="comment-text">{comment.text}</p>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments-text">Be the first to comment</p>
            )}
          </div>
          <form className="comment-form" onSubmit={handlePostComment}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button type="submit" disabled={submittingComment || !commentText.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Upload Modal for creating new Reel
function ReelUploadModal({ onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) {
      setError("Video size cannot exceed 50MB!");
      return;
    }
    setFile(f);
    setError("");
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      if (f.type.startsWith("video/")) {
        handleFileChange({ target: { files: [f] } });
      } else {
        setError("Only video files are supported!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setProgress(0);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("caption", caption);

    try {
      await axios.post(`${API}/api/reels`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
      onUploaded();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Reel upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reels-modal-overlay" onClick={onClose}>
      <div className="reels-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Reel</h3>
          <button className="close-modal" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {preview ? (
            <div className="reel-preview-container">
              <video src={preview} controls loop muted className="reel-upload-preview" />
              <button
                type="button"
                className="change-video-btn"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                disabled={loading}
              >
                Change Video
              </button>
            </div>
          ) : (
            <div
              className="reel-drag-drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <label htmlFor="reel-video-input" className="drag-drop-label">
                <span className="upload-icon">🎬</span>
                <p>Choose video file or drag and drop here</p>
                <span className="subtext">MP4, MOV, WEBM (Max 50MB)</span>
              </label>
              <input
                id="reel-video-input"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          )}

          <div className="form-fields">
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={300}
              disabled={loading}
            />
            <span className="char-count">{caption.length}/300</span>
          </div>

          {loading && (
            <div className="upload-progress-container">
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <p>Uploading... {progress}%</p>
            </div>
          )}

          {error && <div className="error-message">⚠️ {error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              disabled={!file || loading}
            >
              {loading ? "Sharing..." : "Share Reel 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
