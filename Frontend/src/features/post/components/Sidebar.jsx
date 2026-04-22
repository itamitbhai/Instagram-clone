// import React from "react";
// import {
//   Home,
//   Search,
//   Compass,
//   Heart,
//   PlusSquare,
//   User,
//   MessageCircle,
//   Menu,
//   PlayCircle
// } from "lucide-react";

// import "../style/sidebar.scss";

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="logo">Insta</div>

//       <div className="nav-links">
//         <NavItem icon={<Home />} text="Home" active />
//         <NavItem icon={<Search />} text="Search" />
//         <NavItem icon={<Compass />} text="Explore" />
//         <NavItem icon={<PlayCircle />} text="Reels" />
//         <NavItem icon={<MessageCircle />} text="Messages" />
//         <NavItem icon={<Heart />} text="Notifications" />
//         <NavItem icon={<PlusSquare />} text="Create" />
//         <NavItem icon={<User />} text="Profile" />
//       </div>

//       <div className="bottom">
//         <NavItem icon={<Menu />} text="More" />
//       </div>
//     </div>
//   );
// };

// const NavItem = ({ icon, text, active, badge }) => {
//   return (
//     <div className={`nav-item ${active ? "active" : ""}`}>
//       <div className="icon">
//         {icon}
//         {badge && <span className="badge">{badge}</span>}
//       </div>
//       <span className="text">{text}</span>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";
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

import { useNavigate } from "react-router-dom";  // 👈 important

import "../style/sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();  // 👈 hook

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
        
        {/* 👇 IMPORTANT */}
        <NavItem 
          icon={<PlusSquare />} 
          text="Create" 
          onClick={() => navigate("/create-post")} 
        />

        <NavItem icon={<User />} text="Profile" />
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
      onClick={onClick}   // 👈 click handler
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