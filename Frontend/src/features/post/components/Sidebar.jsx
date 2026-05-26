import React from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  Home, Search, Compass, PlusSquare,
  User, MessageCircle, PlayCircle, LogOut
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../style/sidebar.scss";
import Notification from "./Notification";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();

  const handleMessages = async () => {
    navigate("/messages");
    try {
      if (!user?._id) return;
      const res = await fetch(`http://localhost:3000/api/conversations/${user._id}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        navigate("/messages", { state: { conversation: data[0] } });
      }
    } catch (err) {
      console.log("Message fetch error:", err);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">Insta</div>

      <div className="nav-links">
        <NavItem icon={<Home />} text="Home" active={location.pathname === "/"} onClick={() => navigate("/")} className="mobile-show" />
        <NavItem icon={<Search />} text="Search" className="mobile-show" />
        <NavItem icon={<Compass />} text="Explore" />
        <NavItem icon={<PlayCircle />} text="Reels" className="mobile-show" />
        <NavItem icon={<MessageCircle />} text="Messages" active={location.pathname === "/messages"} onClick={handleMessages} className="mobile-show" />

        {/* Notifications — desktop only */}
        <div className="nav-item mobile-hide notification-item">
          <Notification userId={user?._id} />
          <span>Notifications</span>
        </div>

        <NavItem icon={<PlusSquare />} text="Create" onClick={() => navigate("/create-post")} />

        {/* Profile — sabse neeche, mobile mein bhi show */}
        <NavItem
          icon={<User />}
          text="Profile"
          active={location.pathname.includes("/profile")}
          onClick={() => { if (!user?.username) return; navigate(`/profile/${user.username}`); }}
          className="mobile-show profile-item"
        />
      </div>

      {/* Logout — desktop sidebar bottom, mobile hide */}
      <div
        className="nav-item logout mobile-hide"
        onClick={() => { handleLogout(); navigate("/login"); }}
      >
        <LogOut />
        <span>Logout</span>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick, className = "" }) => (
  <div
    className={`nav-item ${active ? "active" : ""} ${className}`}
    onClick={(e) => { e.stopPropagation(); if (onClick) onClick(); }}
  >
    {icon}
    <span>{text}</span>
  </div>
);

export default Sidebar;