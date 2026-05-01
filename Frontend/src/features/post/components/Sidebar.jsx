// import React from "react";
// import { useAuth } from "../../auth/hooks/useAuth";
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

// import { useNavigate } from "react-router-dom";
// import "../style/sidebar.scss";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // 🔥 HANDLE MESSAGES CLICK
//   const handleMessages = async () => {
//     try {
//       if (!user?._id) {
//         console.log("❌ User not loaded");
//         return;
//       }

//       const res = await fetch(
//         `http://localhost:3000/api/conversations/${user._id}`
//       );

//       const data = await res.json();

//       console.log("📩 Conversations:", data);

//       // ✅ agar chats exist karti hain
//       if (Array.isArray(data) && data.length > 0) {
//         navigate("/messages", {
//           state: { conversation: data[0] } // 👈 first chat auto open
//         });
//       } else {
//         // ✅ no chats
//         navigate("/messages");
//       }

//     } catch (err) {
//       console.log("❌ Message Click Error:", err);
//       navigate("/messages");
//     }
//   };

//   return (
//     <div className="sidebar">
//       <div className="logo">Insta</div>

//       <div className="nav-links">

//         <NavItem icon={<Home />} text="Home" onClick={() => navigate("/")} />
//         <NavItem icon={<Search />} text="Search" />
//         <NavItem icon={<Compass />} text="Explore" />
//         <NavItem icon={<PlayCircle />} text="Reels" />
//         <NavItem icon={<Heart />} text="Notifications" />

//         {/* 🔥 FIXED MESSAGES */}
//         <NavItem 
//           icon={<MessageCircle />} 
//           text="Messages" 
//           onClick={handleMessages}
//         />

//         {/* CREATE */}
//         <NavItem 
//           icon={<PlusSquare />} 
//           text="Create" 
//           onClick={() => navigate("/create-post")} 
//         />

//         {/* PROFILE */}
//         <NavItem 
//           icon={<User />} 
//           text="Profile" 
//           onClick={() => {
//             if (!user?.username) {
//               console.log("User not loaded yet");
//               return;
//             }
//             navigate(`/profile/${user.username}`);
//           }}
//         />

//       </div>

//       <div className="bottom">
//         <NavItem icon={<Menu />} text="More" />
//       </div>
//     </div>
//   );
// };

// // 🔹 NAV ITEM COMPONENT
// const NavItem = ({ icon, text, active, badge, onClick }) => {
//   return (
//     <div 
//       className={`nav-item ${active ? "active" : ""}`} 
//       onClick={onClick}
//       style={{ cursor: "pointer" }}
//     >
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
      } else {
        navigate("/messages");
      }
    } catch (err) {
      navigate("/messages");
    }
  };

  return (
    <div className="sidebar">

      <div className="logo">Insta</div>

      <div className="nav-links">

        <NavItem
          icon={<Home />}
          text="Home"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />

        <NavItem icon={<Search />} text="Search" />
        <NavItem icon={<Compass />} text="Explore" />
        <NavItem icon={<PlayCircle />} text="Reels" />

        <NavItem
          icon={<MessageCircle />}
          text="Messages"
          active={location.pathname === "/messages"}
          onClick={handleMessages}
        />

        <NavItem icon={<Heart />} text="Notifications" />

        <NavItem
          icon={<PlusSquare />}
          text="Create"
          onClick={() => navigate("/create-post")}
        />

        <NavItem
          icon={<User />}
          text="Profile"
          active={location.pathname.includes("/profile")}
          onClick={() => {
            if (!user?.username) return;
            navigate(`/profile/${user.username}`);
          }}
        />
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, active, onClick }) => {
  return (
    <div
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default Sidebar;