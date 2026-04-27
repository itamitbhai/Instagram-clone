import React from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  Home,
  Search,
  Compass,
  Heart,
  PlusSquare,
  User,
  MessageCircle,
  Menu,
  PlayCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "../style/sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();   

  return (
    <div className="sidebar">
      <div className="logo">Insta</div>

      <div className="nav-links">

        <NavItem icon={<Home />} text="Home" onClick={() => navigate("/")} />
        <NavItem icon={<Search />} text="Search" />
        <NavItem icon={<Compass />} text="Explore" />
        <NavItem icon={<PlayCircle />} text="Reels" />
        <NavItem icon={<MessageCircle />} text="Messages" />
        <NavItem icon={<Heart />} text="Notifications" />

        {/* CREATE */}
        <NavItem 
          icon={<PlusSquare />} 
          text="Create" 
          onClick={() => navigate("/create-post")} 
        />

        {/* 🔥 FIXED PROFILE */}
        <NavItem 
          icon={<User />} 
          text="Profile" 
          onClick={() => {
            if (!user?.username) {
              console.log("User not loaded yet");
              return;
            }
            navigate(`/profile/${user.username}`);
          }}
        />

      </div>

      <div className="bottom">
        <NavItem icon={<Menu />} text="More" />
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, badge, onClick }) => {
  return (
    <div 
      className={`nav-item ${active ? "active" : ""}`} 
      onClick={onClick}
      style={{ cursor: "pointer" }}   
    >
      <div className="icon">
        {icon}
        {badge && <span className="badge">{badge}</span>}
      </div>
      <span className="text">{text}</span>
    </div>
  );
};

export default Sidebar;