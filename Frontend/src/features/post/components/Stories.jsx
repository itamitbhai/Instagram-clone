import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { getUserAvatar } from "../../../config";
import "../style/Stories.scss";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };
};

const imgUrl = (path) => {
  if (!path) return "/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${API}${path}`;
};

// ─────────────────────────────────────────────────────────────────
//  StoriesBar — feed ke upar wali circular avatars strip
// ─────────────────────────────────────────────────────────────────
export function StoriesBar({ currentUser }) {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loadingFeed, setLoadingFeed] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoadingFeed(true);
      const { data } = await axios.get(`${API}/api/stories/feed`, getAuthConfig());
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Stories fetch error:", err);
      setGroups([]);
    } finally {
      setLoadingFeed(false);
    }
  };

  return (
    <>
      <div className="stories-bar">
        {/* Apni story add karo */}
        <div className="story-avatar-wrap" onClick={() => setShowUpload(true)}>
          <div className="story-ring story-ring--add">
            <img
              src={getUserAvatar(currentUser)}
              alt="Add story"
              className="story-avatar"
            />
            <span className="story-add-icon">+</span>
          </div>
          <span className="story-username">Your Story</span>
        </div>

        {/* Loading skeleton */}
        {loadingFeed && [1, 2, 3].map((i) => (
          <div key={i} className="story-avatar-wrap">
            <div className="story-ring story-ring--skeleton" />
            <span className="story-username story-username--skeleton" />
          </div>
        ))}

        {/* Followed users ki stories */}
        {!loadingFeed && groups.map((group) => (
          <div
            key={group.user._id}
            className="story-avatar-wrap"
            onClick={() => setActiveGroup(group)}
          >
            <div className={`story-ring ${group.hasUnviewed ? "story-ring--unviewed" : "story-ring--viewed"}`}>
              <img
                src={getUserAvatar(group.user)}
                alt={group.user.username}
                className="story-avatar"
              />
            </div>
            <span className="story-username">{group.user.username}</span>
          </div>
        ))}

        {/* Koi story nahi */}
        {!loadingFeed && groups.length === 0 && (
          <span className="stories-empty">No stories available</span>
        )}
      </div>

      {activeGroup && (
        <StoryViewer
          group={activeGroup}
          currentUserId={currentUser?._id}
          onClose={() => {
            setActiveGroup(null);
            fetchStories();
          }}
        />
      )}

      {showUpload && (
        <StoryUpload
          onClose={() => setShowUpload(false)}
          onUploaded={() => {
            setShowUpload(false);
            fetchStories();
          }}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
//  StoryViewer — full screen story with progress bar
// ─────────────────────────────────────────────────────────────────
function StoryViewer({ group, currentUserId, onClose }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const intervalRef = useRef(null);
  const DURATION = 5000;
  const TICK = 50;

  const stories = group.stories;
  const current = stories[storyIndex];

  // Mark as viewed
  useEffect(() => {
    if (current) {
      axios.put(`${API}/api/stories/${current._id}/view`, {}, getAuthConfig()).catch(() => {});
      setImgLoaded(false); // reset loader on story change
    }
  }, [storyIndex, current]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [storyIndex]);

  // Progress timer — sirf tab chale jab image load ho gayi ho
  useEffect(() => {
    if (paused || !imgLoaded) return;
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK / DURATION) * 100;
        if (next >= 100) {
          goNext();
          return 0;
        }
        return next;
      });
    }, TICK);

    return () => clearInterval(intervalRef.current);
  }, [storyIndex, paused, imgLoaded]);

  const goNext = useCallback(() => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [storyIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (storyIndex > 0) setStoryIndex((i) => i - 1);
  }, [storyIndex]);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 60000);
    if (diff < 1) return "abhi abhi";
    if (diff < 60) return `${diff}m pehle`;
    return `${Math.floor(diff / 60)}h pehle`;
  };

  if (!current) return null;

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div
        className="story-viewer"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Progress bars */}
        <div className="story-progress-bars">
          {stories.map((_, i) => (
            <div key={i} className="story-progress-track">
              <div
                className="story-progress-fill"
                style={{
                  width: i < storyIndex ? "100%" : i === storyIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="story-header">
          <img
            src={getUserAvatar(group.user)}
            alt={group.user.username}
            className="story-header-avatar"
          />
          <div>
            <span className="story-header-name">{group.user.username}</span>
            <span className="story-header-time">{timeAgo(current.createdAt)}</span>
          </div>
          <button className="story-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Image loader */}
        {!imgLoaded && <div className="story-img-loader" />}

        {/* Story image */}
        <img
          src={imgUrl(current.image)}
          alt="story"
          className="story-image"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />

        {/* Caption */}
        {current.caption && (
          <div className="story-caption">{current.caption}</div>
        )}

        {/* Story counter */}
        <div className="story-counter">{storyIndex + 1} / {stories.length}</div>

        {/* Tap zones */}
        <div className="story-tap-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} />
        <div className="story-tap-next" onClick={(e) => { e.stopPropagation(); goNext(); }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  StoryUpload — story upload modal
// ─────────────────────────────────────────────────────────────────
function StoryUpload({ onClose, onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setError("File 10MB se badi hai!");
      return;
    }
    setFile(f);
    setError("");
    setPreview(URL.createObjectURL(f));
  };

  // Drag & drop support
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile({ target: { files: [f] } });
  };

  const handleSubmit = async () => {
    if (!file) return setError("Pehle image select karo");
    setLoading(true);
    setError("");
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("caption", caption);
      await axios.post(`${API}/api/stories`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        withCredentials: true,
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
      onUploaded();
    } catch (err) {
      setError(err.response?.data?.message || "Upload fail ho gaya, dobara try karo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-viewer-overlay" onClick={onClose}>
      <div className="story-upload-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="story-upload-title">New Story</h3>

        {preview ? (
          <div className="story-upload-preview-wrap">
            <img src={preview} alt="preview" className="story-upload-preview" />
            <button className="story-upload-change" onClick={() => { setPreview(null); setFile(null); setUploadProgress(0); }}>
              change
            </button>
          </div>
        ) : (
          <label
            className="story-upload-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            <span className="story-upload-icon">📷</span>
            <span>Photo choose karo or drag & drop </span>
            <span className="story-upload-hint">JPG, PNG, WEBP • Max 10MB</span>
          </label>
        )}

        <input
          type="text"
          placeholder="Caption likho... (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={200}
          className="story-caption-input"
        />
        <span className="story-caption-count">{caption.length}/200</span>

        {/* Upload progress bar */}
        {loading && (
          <div className="story-upload-progress-track">
            <div className="story-upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {error && <p className="story-error">⚠️ {error}</p>}

        <div className="story-upload-actions">
          <button onClick={onClose} className="story-btn story-btn--cancel" disabled={loading}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading || !file} className="story-btn story-btn--submit">
            {loading ? `Uploading... ${uploadProgress}%` : "Share Story  🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}