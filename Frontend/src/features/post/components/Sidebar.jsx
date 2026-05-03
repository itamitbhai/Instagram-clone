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
  PlayCircle
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import "../style/sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleMessages = async () => {
    navigate("/messages");

    try {
      if (!user?._id) return;

      const res = await fetch(
        `http://localhost:3000/api/conversations/${user._id}`
      );

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        navigate("/messages", {
          state: { conversation: data[0] }
        });
      }
    } catch (err) {
      console.log("Message fetch error:", err);
    }
  };

  // 🔥 Clean menu config (scalable)
  const menuItems = [
    {
      icon: <Home />,
      text: "Home",
      path: "/"
    },
    {
      icon: <Search />,
      text: "Search"
    },
    {
      icon: <Compass />,
      text: "Explore"
    },
    {
      icon: <PlayCircle />,
      text: "Reels"
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
      action: handleMessages,
      path: "/messages"
    },
    {
      icon: <Heart />,
      text: "Notifications"
    },
    {
      icon: <PlusSquare />,
      text: "Create",
      action: () => navigate("/create-post")
    },
    {
      icon: <User />,
      text: "Profile",
      action: () => {
        if (!user?.username) return;
        navigate(`/profile/${user.username}`);
      },
      isProfile: true
    }
  ];

  return (
    <div className="sidebar">
      <div className="logo">Insta</div>

      <div className="nav-links">
        {menuItems.map((item, i) => {
          const isActive =
            item.path
              ? location.pathname === item.path
              : item.isProfile
              ? location.pathname.includes("/profile")
              : false;

          return (
            <NavItem
              key={i}
              icon={item.icon}
              text={item.text}
              active={isActive}
              onClick={
                item.action
                  ? item.action
                  : item.path
                  ? () => navigate(item.path)
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick }) => {
  return (
    <div
      className={`nav-item ${active ? "active" : ""}`}
      onClick={(e) => {
        e.stopPropagation(); // 🔥 prevents weird mobile bugs
        if (onClick) onClick();
      }}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default Sidebar;