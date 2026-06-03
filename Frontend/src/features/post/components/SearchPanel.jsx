import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import axios from "axios";
import gsap from "gsap";
import { API_BASE_URL, getUserAvatar } from "../../../config";
import "../style/searchpanel.scss";

const SearchPanel = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // Animate panel using GSAP
  useEffect(() => {
    if (isOpen) {
      // Fade in and slide out
      gsap.to(panelRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      // Slide back under/left
      gsap.to(panelRef.current, {
        x: "-100%",
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  // Handle live query
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/users/search?q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResults(res.data.users || []);
      } catch (err) {
        console.error("Search API Error:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleUserClick = (username) => {
    setQuery("");
    setResults([]);
    onClose();
    navigate(`/profile/${username}`);
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div className="search-panel-backdrop" onClick={onClose} />
      )}

      <div
        ref={panelRef}
        className="search-panel"
        style={{ transform: "translateX(-100%)", opacity: 0 }}
      >
        <div className="search-panel-header">
          <h2>Search</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {loading && <Loader2 className="spinner" size={18} />}
        </div>

        <div className="search-results-container">
          {query.trim() !== "" && results.length === 0 && !loading && (
            <div className="no-results">No users found</div>
          )}

          <div className="results-list">
            {results.map((user) => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => handleUserClick(user.username)}
              >
                <img
                  src={getUserAvatar(user)}
                  alt={user.username}
                  className="result-avatar"
                />
                <div className="result-info">
                  <span className="result-username">{user.username}</span>
                  {user.bio && (
                    <span className="result-bio">{user.bio}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPanel;
